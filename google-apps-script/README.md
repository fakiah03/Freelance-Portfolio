# Google Apps Script Setup Guide

This folder contains `Code.gs`, which is the backend script that powers the FAKIAH Customer Inquiry Form.

## Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com).
2. Create a new Blank spreadsheet.
3. Name it **FAKIAH Customer Inquiries**.
4. Rename the default "Sheet1" tab at the bottom to **Inquiries**.
5. Copy the **Spreadsheet ID** from the URL. 
   *(Example: if the URL is `https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F/edit`, the ID is `1A2B3C4D5E6F`)*.

## Step 2: Create a Google Drive Folder (For File Uploads)
1. Go to [Google Drive](https://drive.google.com).
2. Create a new folder named **FAKIAH Client Uploads**.
3. Right-click the folder and select **Share**. Change General Access to "Anyone with the link" (Viewer) if you want clients to be able to see the files, or keep it Restricted if only you should see them.
4. Open the folder and copy the **Folder ID** from the URL.
   *(Example: if the URL is `https://drive.google.com/drive/folders/0B1C2D3E4F5G`, the ID is `0B1C2D3E4F5G`)*.

## Step 3: Add the Apps Script Code
1. From your Google Spreadsheet, click **Extensions > Apps Script**.
2. A new tab will open with a code editor. Delete the default `myFunction()`.
3. Open the `Code.gs` file in this folder, copy all of its contents, and paste it into the Google Apps Script editor.

## Step 4: Configure the Script
In the Apps Script editor, locate the `CONFIG` block at the top of the code and replace the placeholder values:
```javascript
const CONFIG = {
  SPREADSHEET_ID: 'PASTE_YOUR_SPREADSHEET_ID_HERE',
  SHEET_NAME: 'Inquiries',
  DRIVE_FOLDER_ID: 'PASTE_YOUR_DRIVE_FOLDER_ID_HERE',
  OWNER_EMAIL: 'your-real-email@gmail.com', // To receive notifications
  ENABLE_EMAIL_NOTIFICATION: true
};
```
Click the **Save** icon (disk).

## Step 5: Deploy the Web App
1. Click the blue **Deploy** button in the top right, then select **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in the following:
   - **Description:** `Initial version`
   - **Execute as:** `Me` (This is very important!)
   - **Who has access:** `Anyone` (This allows the public form to submit data).
4. Click **Deploy**.
5. Google will ask you to **Authorize access**. Follow the prompts (Choose your account -> Advanced -> Go to Untitled project (unsafe) -> Allow).
6. Google will provide a **Web app URL**. Copy this URL!

## Step 6: Connect the Frontend
1. Open `assets/js/config.js` in your website code.
2. Paste the Web App URL you just copied into the `GOOGLE_SCRIPT_URL` variable.
   ```javascript
   GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/..../exec',
   ```
3. Save the `config.js` file.

**You're all done!** Test the form in your browser.
