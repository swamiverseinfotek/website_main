/**
 * ============================================================================
 * SWAMIVERSE INFOTEK · GOOGLE SHEETS & EMAIL DISPATCH PIPELINE
 * ============================================================================
 * Account Email: Swamiverseinfotek@gmail.com
 * 
 * CORE FEATURES:
 * 1. Master Log ("All Enquiries"): Stores every single lead chronologically.
 * 2. Automated Day-Wise Sheet Creation (+sheet tab according to date):
 *    - Automatically creates a brand new sheet tab for each date (e.g., "02-Nov-2026").
 *    - All enquiries received on that day are automatically routed to that day's sheet tab.
 *    - Formats headers with obsidian styling, frozen top row, and optimized column widths.
 * 3. Instant Executive Email Notification to Swamiverseinfotek@gmail.com with
 *    rich dark-themed HTML formatting, lead details, and 1-click reply link.
 * 4. Concurrent Write Protection using LockService.
 * 5. Built-in 'testSubmission' function to test directly inside Apps Script editor!
 * ============================================================================
 */

// Target email for notifications
const NOTIFICATION_EMAIL = "Swamiverseinfotek@gmail.com";

// Name of master historical log tab
const MASTER_SHEET_NAME = "All Enquiries";

// Format for date-wise sheet tabs (e.g. "02-Nov-2026" or "dd-MM-yyyy")
const DATE_SHEET_FORMAT = "dd-MMM-yyyy";

// Timezone for timestamping (Default: IST - Asia/Kolkata)
const DEFAULT_TIMEZONE = "Asia/Kolkata";

/**
 * OPTIONAL: If this script is created via "Extensions > Apps Script" inside your Google Sheet,
 * leave SPREADSHEET_ID empty ("").
 * If this script is created as a standalone script at script.google.com, paste your
 * Google Sheet ID here (from the URL: https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit).
 */
const SPREADSHEET_ID = "";

/**
 * Helper to get the target spreadsheet (bound or standalone)
 */
function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error("Spreadsheet not found. If this is a standalone script at script.google.com, please set SPREADSHEET_ID at the top of the script.");
}

/**
 * HTTP POST Handler - Receives form submissions from the static website
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Wait up to 20 seconds for any concurrent writes to finish
  lock.tryLock(20000);

  try {
    let data = {};

    // 1. Parse JSON payload or URL-encoded payload
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Fallback: parse urlencoded string (e.g., key=val&key2=val2)
        try {
          const raw = e.postData.contents;
          if (typeof raw === "string" && raw.indexOf("=") !== -1) {
            const pairs = raw.split("&");
            data = {};
            for (let i = 0; i < pairs.length; i++) {
              const kv = pairs[i].split("=");
              if (kv.length === 2) {
                data[decodeURIComponent(kv[0].replace(/\+/g, " "))] = decodeURIComponent(kv[1].replace(/\+/g, " "));
              }
            }
          }
        } catch (_) {}
      }
    }

    // 2. Fallback to query parameters
    if ((!data || Object.keys(data).length === 0) && e && e.parameter) {
      data = e.parameter;
    }

    const ss = getSpreadsheet();
    const now = new Date();

    // Timezone configuration (defaults to IST)
    const timeZone = ss.getSpreadsheetTimeZone() || DEFAULT_TIMEZONE;
    const dateFormatted = Utilities.formatDate(now, timeZone, DATE_SHEET_FORMAT); // e.g. "02-Nov-2026"
    const timeFormatted = Utilities.formatDate(now, timeZone, "hh:mm:ss a");
    const timestampFormatted = Utilities.formatDate(now, timeZone, "dd-MMM-yyyy hh:mm:ss a");

    // Extract sanitized form fields
    const fullName = (data.fullName || data.name || "N/A").toString().trim();
    const businessEmail = (data.businessEmail || data.email || "N/A").toString().trim();
    const company = (data.company || "Not Specified").toString().trim();
    const solutionType = (data.solutionType || "General Enquiry").toString().trim();
    const engagementPreference = (data.engagementPreference || "Project-based").toString().trim();
    const problemStatement = (data.problemStatement || data.message || "N/A").toString().trim();
    const sourcePage = (data.sourcePage || "swamiverse.com").toString().trim();

    const headers = [
      "Timestamp",
      "Date",
      "Time",
      "Full Name",
      "Business Email",
      "Company / Organization",
      "Solution Type",
      "Engagement Preference",
      "Problem Statement / Requirements",
      "Lead Source"
    ];

    const rowData = [
      timestampFormatted,
      dateFormatted,
      timeFormatted,
      fullName,
      businessEmail,
      company,
      solutionType,
      engagementPreference,
      problemStatement,
      sourcePage
    ];

    // ------------------------------------------------------------------------
    // 1. MASTER SHEET ("All Enquiries"): Log every lead chronologically
    // ------------------------------------------------------------------------
    let masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
    if (!masterSheet) {
      masterSheet = ss.insertSheet(MASTER_SHEET_NAME, 0);
      setupSheetHeader(masterSheet, headers);
    }
    masterSheet.appendRow(rowData);
    formatDataRow(masterSheet);

    // ------------------------------------------------------------------------
    // 2. DAY-WISE SHEET (+sheet tab for each date): e.g. "02-Nov-2026"
    // Automatically creates a new sheet tab for today's date if it doesn't exist
    // ------------------------------------------------------------------------
    const daySheetName = dateFormatted;
    let daySheet = ss.getSheetByName(daySheetName);
    let isNewDaySheetCreated = false;

    if (!daySheet) {
      // Automatically creates a new tab (+sheet) placed right after the Master sheet
      daySheet = ss.insertSheet(daySheetName, 1);
      setupSheetHeader(daySheet, headers);
      isNewDaySheetCreated = true;
    }
    daySheet.appendRow(rowData);
    formatDataRow(daySheet);

    // ------------------------------------------------------------------------
    // 3. Clean up empty default "Sheet1" if present
    // ------------------------------------------------------------------------
    cleanupDefaultSheet(ss);

    // ------------------------------------------------------------------------
    // 4. Send Instant Email Alert to Swamiverseinfotek@gmail.com
    // ------------------------------------------------------------------------
    sendEmailNotification({
      fullName: fullName,
      businessEmail: businessEmail,
      company: company,
      solutionType: solutionType,
      engagementPreference: engagementPreference,
      problemStatement: problemStatement,
      timestampFormatted: timestampFormatted,
      daySheetName: daySheetName
    });

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Enquiry successfully recorded in day-wise sheet",
        date: dateFormatted,
        time: timeFormatted,
        sheet: daySheetName,
        isNewDaySheet: isNewDaySheetCreated,
        row: daySheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Configure professional dark metallic styling for the header row
 */
function setupSheetHeader(sheet, headers) {
  sheet.appendRow(headers);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);

  headerRange.setBackground("#0F172A"); // Luxury Obsidian / Dark Slate
  headerRange.setFontColor("#F8FAFC"); // Crisp pure white
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10.5);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 38);

  // Set optimized readable column widths
  sheet.setColumnWidth(1, 175); // Timestamp
  sheet.setColumnWidth(2, 115); // Date
  sheet.setColumnWidth(3, 115); // Time
  sheet.setColumnWidth(4, 185); // Full Name
  sheet.setColumnWidth(5, 235); // Business Email
  sheet.setColumnWidth(6, 205); // Company / Organization
  sheet.setColumnWidth(7, 220); // Solution Type
  sheet.setColumnWidth(8, 180); // Engagement Preference
  sheet.setColumnWidth(9, 460); // Problem Statement / Requirements
  sheet.setColumnWidth(10, 150); // Lead Source
}

/**
 * Format recently appended row with alternating clean background & wrapping
 */
function formatDataRow(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  const lastCol = sheet.getLastColumn() || 10;
  const range = sheet.getRange(lastRow, 1, 1, lastCol);
  range.setVerticalAlignment("middle");
  range.setWrap(true);
  range.setFontSize(10);
  range.setFontFamily("Arial");

  // Alternating zebra striping
  if (lastRow % 2 === 0) {
    range.setBackground("#F8FAFC"); // Subtle off-white
  } else {
    range.setBackground("#FFFFFF"); // Pure white
  }
}

/**
 * Remove empty default 'Sheet1' if additional sheets exist
 */
function cleanupDefaultSheet(ss) {
  try {
    const defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getNumSheets() > 1) {
      if (defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0) {
        ss.deleteSheet(defaultSheet);
      }
    }
  } catch (_) {}
}

/**
 * Send a beautifully branded HTML email alert to Swamiverseinfotek@gmail.com
 */
function sendEmailNotification(data) {
  try {
    const subject = `🚀 New Lead: ${data.fullName} — ${data.solutionType}`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07090E; padding: 32px 16px; color: #F1F5F9;">
        <div style="max-width: 620px; margin: 0 auto; background-color: #0F131D; border: 1px solid rgba(212, 175, 110, 0.35); border-radius: 14px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #181534 0%, #0D0F1B 100%); padding: 26px 28px; border-bottom: 2px solid #D4AF6E;">
            <div style="font-size: 11px; letter-spacing: 0.18em; color: #D4AF6E; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">SWAMIVERSE INFOTEK · LEAD DISPATCH</div>
            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">New Architecture Enquiry Received</h1>
            <div style="margin-top: 8px; font-size: 12px; color: #94A3B8;">Stored in daily sheet tab: <strong style="color: #FBBF24;">${data.daySheetName}</strong></div>
          </div>

          <!-- Body Content -->
          <div style="padding: 26px 28px; color: #CBD5E1; font-size: 14px; line-height: 1.6;">
            <p style="margin-top: 0; color: #E2E8F0;">
              A prospective client has submitted an enquiry through the website. Here are the captured details:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(255, 255, 255, 0.02); border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #94A3B8; font-weight: 600; width: 34%;">Client Name:</td>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #FFFFFF; font-weight: 700; font-size: 15px;">${data.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #94A3B8; font-weight: 600;">Business Email:</td>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #38BDF8; font-weight: 600;">
                  <a href="mailto:${data.businessEmail}" style="color: #38BDF8; text-decoration: none;">${data.businessEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #94A3B8; font-weight: 600;">Organization:</td>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #FFFFFF;">${data.company}</td>
              </tr>
              <tr>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #94A3B8; font-weight: 600;">Domain / Solution:</td>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #FBBF24; font-weight: 600;">${data.solutionType}</td>
              </tr>
              <tr>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #94A3B8; font-weight: 600;">Engagement Model:</td>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #34D399; font-weight: 600;">${data.engagementPreference}</td>
              </tr>
              <tr>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #94A3B8; font-weight: 600;">Submission Timestamp:</td>
                <td style="padding: 11px 14px; border-bottom: 1px solid #1E293B; color: #CBD5E1;">${data.timestampFormatted}</td>
              </tr>
            </table>

            <!-- Problem Statement Quote -->
            <div style="background-color: #07090E; border-left: 3px solid #D4AF6E; padding: 16px 18px; border-radius: 6px; margin: 20px 0;">
              <span style="display: block; color: #D4AF6E; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">Client Challenge / Message:</span>
              <div style="white-space: pre-wrap; color: #F1F5F9; font-size: 13.5px; line-height: 1.6;">${data.problemStatement}</div>
            </div>

            <!-- Direct Action Button -->
            <div style="margin: 28px 0 10px 0; text-align: center;">
              <a href="mailto:${data.businessEmail}?subject=Re:%20Enquiry%20to%20Swamiverse%20Infotek%20-%20${encodeURIComponent(data.solutionType)}" 
                 style="background: linear-gradient(135deg, #D4AF6E 0%, #A88242 100%); color: #07090E; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(212, 175, 110, 0.4);">
                Reply to ${data.fullName} →
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #07090E; padding: 16px 28px; font-size: 11.5px; color: #64748B; text-align: center; border-top: 1px solid #1E293B;">
            Automated by Swamiverse Infotek · Google Sheets Lead Pipeline · <a href="mailto:${NOTIFICATION_EMAIL}" style="color: #94A3B8;">${NOTIFICATION_EMAIL}</a>
          </div>

        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: data.businessEmail
    });
  } catch (err) {
    Logger.log("Email Notification Warning: " + err.toString());
  }
}

/**
 * HTTP GET Handler - Useful for testing if the Web App is online in a web browser
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "online",
      service: "Swamiverse Infotek Google Sheets & Email Dispatcher",
      targetEmail: NOTIFICATION_EMAIL,
      masterSheet: MASTER_SHEET_NAME,
      dateFormat: DATE_SHEET_FORMAT,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ============================================================================
 * ONE-CLICK TEST FUNCTION (Directly in Apps Script Editor)
 * ============================================================================
 * You can test the date sheet creation (+sheet) right now:
 * 1. Select 'testSubmission' in the function dropdown above
 * 2. Click the 'Run' button
 * 3. Switch to your Google Sheet — today's tab will appear automatically!
 */
function testSubmission() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        fullName: "Prathmesh (Test Verification)",
        businessEmail: "test@swamiverse.com",
        company: "Swamiverse Infotek Test Org",
        solutionType: "AI & Machine Learning",
        engagementPreference: "Project-based",
        problemStatement: "Testing automated day-wise (+sheet tab) creation according to date.",
        sourcePage: "http://localhost:8000/index.html"
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log("Execution Result:\n" + result.getContent());
}
