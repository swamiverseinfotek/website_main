# 📊 Swamiverse Infotek · Google Sheets & Email Dispatcher Setup

This guide connects the **Swamiverse Infotek** enquiry form to store responses **day-wise in Google Sheets** (automatically creating a new sheet tab `+sheet` according to each date) and send instant alert notifications to **Swamiverseinfotek@gmail.com**.

---

## ⚡ Quick 2-Minute Deployment Steps

### Step 1: Open Google Sheets
1. Log into your Google account: **`Swamiverseinfotek@gmail.com`**.
2. Go to **[sheets.new](https://sheets.new)** to create a new spreadsheet.
3. Rename the sheet at the top left to:
   ```
   Swamiverse Infotek — Client Enquiries
   ```

---

### Step 2: Open Apps Script Editor
1. In your new Google Sheet menu bar, click:
   **`Extensions` ➔ `Apps Script`**.
2. A new code editor tab will open.
3. Delete any default placeholder code inside the editor (`function myFunction() { ... }`).

---

### Step 3: Paste the Script Code
1. Open [`google_sheets_apps_script.js`](google_sheets_apps_script.js) from your project folder.
2. Copy the entire contents of that file and paste it into the Google Apps Script editor.
3. Click the 💾 **Save** icon (or press `Cmd + S` / `Ctrl + S`).

---

### Step 4: (Optional) 1-Click Verification Test
Before deploying, you can test tab creation right inside the Apps Script editor:
1. At the top toolbar, in the function dropdown, select **`testSubmission`**.
2. Click **`Run`**.
3. When prompted, click **`Review permissions`** and allow access to your sheet and Gmail.
4. Switch back to your Google Sheet:
   - You will immediately see a new sheet tab created for today's date (e.g. **`02-Nov-2026`**) alongside the **`All Enquiries`** master tab!
   - You will also receive the test lead email notification in `Swamiverseinfotek@gmail.com`.

---

### Step 5: Deploy as Web App
1. At the top right of the Apps Script window, click the blue **`Deploy`** button ➔ **`New deployment`**.
2. Click the gear icon ⚙️ next to "Select type" and select **`Web app`**.
3. Fill in the deployment settings:
   - **Description**: `Swamiverse Enquiry Dispatcher v1.0`
   - **Execute as**: `Me (Swamiverseinfotek@gmail.com)`
   - **Who has access**: **`Anyone`** *(Required so website visitors can submit the form without logging into Google)*.
4. Click **`Deploy`**.

---

### Step 6: Authorize Access
1. Google will display an **"Authorization required"** dialog (if not done in Step 4).
2. Click **`Authorize access`** and select **`Swamiverseinfotek@gmail.com`**.
3. If Google displays *"Google hasn't verified this app"*:
   - Click **`Advanced`** (small link at bottom left).
   - Click **`Go to Untitled project (unsafe)`**.
   - Click **`Allow`** to grant permission to write to the spreadsheet and dispatch notification emails.

---

### Step 7: Copy Web App URL & Paste into `config.js`
1. Google will display your unique **Web App URL**, which looks like:
   ```text
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
2. Copy this URL.
3. Open [`config.js`](config.js) in your website folder.
4. Paste your Web App URL into `GOOGLE_SHEETS_SCRIPT_URL`:
   ```javascript
   window.SWAMIVERSE_CONFIG = {
     GOOGLE_SHEETS_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   };
   ```
5. Save `config.js`. Your live enquiry form is now connected!

---

## 🎯 How the Automated Day-Wise Sheet Tab (`+sheet`) Works:

1. **Automatic New Sheet Creation per Date (`+sheet`)**:
   - Whenever a visitor submits an enquiry, the script checks if a sheet tab exists for today's date (formatted as `DD-MMM-YYYY`, e.g., `02-Nov-2026`).
   - If today's tab **does not exist**, it automatically adds a new sheet tab (equivalent to clicking the `+` button in Google Sheets) named after the date!
   - If enquiries have already been logged today, it appends the new enquiry into today's existing sheet tab.
   - Automatically applies Obsidian Slate headers (`#0F172A`), white bold text, freezes the top row, and auto-formats row heights and column widths.
   - Automatically removes the blank default `Sheet1`.

2. **Master Log Tab (`All Enquiries`)**:
   - Every single lead is simultaneously stored in the master tab chronologically for high-level business intelligence.

3. **Instant Email Notification**:
   - Dispatches a luxury dark-mode HTML alert directly to **`Swamiverseinfotek@gmail.com`**.
   - Contains Full Name, Business Email, Organization, Solution Domain, Engagement Preference, Problem Statement, Timestamp, and a 1-click **"Reply to Client"** button.
