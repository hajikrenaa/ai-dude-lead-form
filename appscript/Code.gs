/**
 * AI Dude - Store Build landing page + lead capture.
 *
 * Serves Index.html as a Web App and writes every submitted lead
 * (name, email, phone) into the Google Sheet below.
 *
 * Sheet: https://docs.google.com/spreadsheets/d/1yszd_HHYOGPTmavSCiYBI0vS4hyaxQ4QzTzI8AxRZ4Y/edit
 */

// The spreadsheet that receives the leads. Only the ID goes here (the long
// string in the sheet URL between /d/ and /edit).
var SHEET_ID = '1yszd_HHYOGPTmavSCiYBI0vS4hyaxQ4QzTzI8AxRZ4Y';

// gid=0 is the first tab. Leave as 0 to use the first sheet, or set the
// exact tab name (e.g. 'Leads') if you rename it.
var SHEET_GID = 0;

/** Serve the landing page. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('AI Dude - Build your eCommerce store in half a day')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Return the target sheet (by gid, falling back to the first tab). */
function getLeadSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === SHEET_GID) return sheets[i];
  }
  return sheets[0];
}

/** Light server-side validation so junk never lands in the sheet. */
function cleanLead_(data) {
  data = data || {};
  var name = String(data.name || '').trim().slice(0, 100);
  var email = String(data.email || '').trim().slice(0, 120);
  var phone = String(data.phone || '').replace(/[^\d+ ]/g, '').trim().slice(0, 20);
  var digits = phone.replace(/\D/g, '');

  if (name.length < 2) throw new Error('Invalid name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
  if (!(digits.length === 10 || (digits.length === 12 && digits.indexOf('91') === 0))) {
    throw new Error('Invalid phone');
  }
  return { name: name, email: email, phone: phone };
}

/**
 * Called by the page (google.script.run.submitLead) when the form is
 * submitted. Appends one row to the sheet. A ScriptLock prevents two
 * concurrent submissions from writing to the same row.
 */
function submitLead(data) {
  var lead = cleanLead_(data);
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = getLeadSheet_();
    // Add a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone']);
    }
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1).setValue(new Date());
    sheet.getRange(row, 2).setValue(lead.name);
    sheet.getRange(row, 3).setValue(lead.email);
    // Write the phone as PLAIN TEXT so a leading "+" is not treated as a
    // formula (which shows #ERROR!) and long numbers don't become 9.1E+11.
    var phoneCell = sheet.getRange(row, 4);
    phoneCell.setNumberFormat('@');
    phoneCell.setValue(lead.phone);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Optional: accept leads from an external HTTP POST as well
 * (e.g. if you ever embed the form elsewhere). Send JSON:
 * { "name": "...", "email": "...", "phone": "..." }
 */
function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    submitLead(data);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err && err.message || err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
