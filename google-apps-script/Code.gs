/**
 * FAKIAH Customer Inquiry Form - Google Apps Script Backend
 * 
 * IMPORTANT CONFIGURATION:
 * Replace these values before deploying!
 */
const CONFIG = {
  // 1. The ID of the spreadsheet (found in the URL)
  SPREADSHEET_ID: '1MtY-Kv6BbnbBT51yAHQ8_qH5qjMVWEyuzf9mqGXhgj4',
  
  // 2. The name of the sheet tab (default is 'Inquiries')
  SHEET_NAME: 'Inquiries',
  
  // 3. The ID of the Google Drive folder to save uploads (found in the URL)
  // Example: '1A2b3C4d5E6f7G8h9I0jKLMNOP'
  DRIVE_FOLDER_ID: '1OAxS_0f3uo4DG5ESs-DUYHd3QT0K7SIf',
  
  // 4. Your email address to receive notifications
  OWNER_EMAIL: 'fakiahadnan@gmail.com',
  
  // 5. Enable/Disable features
  ENABLE_EMAIL_NOTIFICATION: false
};

/**
 * Handle POST requests from the HTML form
 */
function doPost(e) {
  try {
    // Apps Script typically receives payload in e.postData.contents
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error("No data received");
    }

    // 1. Validate Required Fields (Server-Side)
    if (!data.fullName || !data.email || !data.projectTitle || !data.projectDescription || !data.consent) {
      return createJsonResponse({ success: false, message: "Missing required fields." });
    }

    // 2. Generate Metadata
    const timestamp = new Date();
    const inquiryId = generateInquiryId(timestamp);
    const defaultStatus = 'New';
    let fileUrl = 'No file attached';

    // 3. Handle File Upload to Google Drive (if present)
    if (data.file && data.file.content) {
      try {
        fileUrl = uploadToDrive(data.file.name, data.file.mimeType, data.file.content);
      } catch (fileErr) {
        // We log it but still save the form data
        console.error("File upload failed: " + fileErr.message);
        fileUrl = "Upload failed: " + fileErr.message;
      }
    }

    // 4. Save to Google Sheets
    saveToSheet([
      timestamp,
      inquiryId,
      data.fullName,
      data.email,
      data.company || '',
      data.preferredContact || '',
      Array.isArray(data.service) ? data.service.join(', ') : '',
      data.projectTitle,
      data.projectDescription,
      '', // Data Type (deprecated/merged in UI)
      Array.isArray(data.fileFormat) ? data.fileFormat.join(', ') : '',
      data.dataSize || '',
      fileUrl,
      data.deadline || '',
      data.urgency || '',
      data.budget || '',
      data.additionalRequirements || '',
      data.source || '',
      data.consent ? 'Yes' : 'No',
      defaultStatus
    ]);

    // 5. Send Email Notification
    if (CONFIG.ENABLE_EMAIL_NOTIFICATION) {
      sendEmailNotification(inquiryId, data, fileUrl);
    }

    // 6. Return Success Response
    return createJsonResponse({
      success: true,
      inquiryId: inquiryId
    });

  } catch (error) {
    console.error("Error processing request: " + error.toString());
    return createJsonResponse({
      success: false,
      message: "An error occurred while processing the request."
    });
  }
}

/**
 * Handle GET requests (Useful for pinging the script to see if it's active)
 */
function doGet(e) {
  return createJsonResponse({ status: "active", message: "FAKIAH Inquiry Form API is running." });
}

/**
 * Helper to upload a base64 string as a file to Google Drive
 */
function uploadToDrive(filename, mimeType, base64Data) {
  if (!CONFIG.DRIVE_FOLDER_ID || CONFIG.DRIVE_FOLDER_ID === 'YOUR_DRIVE_FOLDER_ID_HERE') {
    return 'Upload skipped: Drive Folder ID not configured';
  }
  
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  
  // Decode Base64 data
  const decodedData = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decodedData, mimeType, filename);
  
  // Create file in folder
  const file = folder.createFile(blob);
  
  // Return the link to the file
  return file.getUrl();
}

/**
 * Helper to save a row of data to Google Sheets
 */
function saveToSheet(rowData) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  // If the sheet doesn't exist, create it and add headers
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    const headers = [
      "Timestamp", "Inquiry ID", "Full Name", "Email", "Company", "Preferred Contact", 
      "Service", "Project Title", "Project Description", "Data Type", "File Format", 
      "Data Size", "File URL", "Deadline", "Urgency", "Budget", "Additional Requirements", 
      "Source", "Consent", "Status"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#D8C7FF");
    sheet.setFrozenRows(1);
  }
  
  // Append the data
  sheet.appendRow(rowData);
}

/**
 * Helper to send email notification to the owner
 */
function sendEmailNotification(inquiryId, data, fileUrl) {
  if (!CONFIG.OWNER_EMAIL || CONFIG.OWNER_EMAIL === 'YOUR_EMAIL@example.com') return;
  
  const subject = `New Customer Inquiry — ${inquiryId}`;
  
  const body = `
    Hi Fakiah,
    
    You have received a new inquiry from your website.
    
    INQUIRY DETAILS:
    --------------------------------------------------
    ID: ${inquiryId}
    Name: ${data.fullName}
    Email: ${data.email}
    Company: ${data.company || 'N/A'}
    Service(s): ${Array.isArray(data.service) ? data.service.join(', ') : data.service}
    Project Title: ${data.projectTitle}
    
    Budget: ${data.budget || 'Not specified'}
    Urgency: ${data.urgency || 'Normal'}
    Deadline: ${data.deadline || 'Not specified'}
    
    File Upload: ${fileUrl}
    
    Please check your Google Sheet for full details.
  `;
  
  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAIL,
    subject: subject,
    body: body
  });
}

/**
 * Generate a unique ID (e.g., FAK-20260815-001)
 */
function generateInquiryId(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `FAK-${year}${month}${day}-${rand}`;
}

/**
 * Return JSON response wrapped properly for CORS compatibility
 */
function createJsonResponse(responseObject) {
  return ContentService.createTextOutput(JSON.stringify(responseObject))
    .setMimeType(ContentService.MimeType.JSON);
}
