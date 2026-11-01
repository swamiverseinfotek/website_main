/**
 * ============================================================================
 * SWAMIVERSE INFOTEK · RUNTIME CONFIGURATION
 * ============================================================================
 * 
 * Google Apps Script Web App Endpoint for Client Enquiries:
 * Dispatches leads into date-wise sheet tabs (+sheet) and sends email alerts
 * to Swamiverseinfotek@gmail.com.
 */

window.SWAMIVERSE_CONFIG = {
  GOOGLE_SHEETS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzzcsTu1Lw6CGgTUJ-XdQmX0LqB2OjKbMCxOPD1g6B2mzrXYeWgaT-ZDnyxqYAoK_A8/exec"
};

// Backwards-compatible global alias
window.SWAMIVERSE_SHEETS_URL = window.SWAMIVERSE_CONFIG.GOOGLE_SHEETS_SCRIPT_URL;
