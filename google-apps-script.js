/**
 * Google Apps Script - Wedding RSVP Handler
 * 
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1KFPGKPi2ebYJ58RWXNZchtrWyWPmlxbs1OepzGACsUo/edit
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Set "Execute as": Me
 * 7. Set "Who has access": Anyone
 * 8. Click "Deploy" and copy the Web App URL
 * 9. Paste that URL into the RSVP section settings in the Wedding Invitation Builder
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GuestConfirm');
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('GuestConfirm');
      // Add headers
      sheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Họ tên', 'Tham dự', 'Số người', 'Lời chúc']]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    
    var data = JSON.parse(e.postData.contents);
    
    var timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    var name = data.name || '';
    var attendance = data.attendance || '';
    var guests = data.guests || '';
    var message = data.message || '';
    
    // Append new row
    sheet.appendRow([timestamp, name, attendance, guests, message]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Cảm ơn bạn đã xác nhận!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success', message: 'RSVP endpoint is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}
