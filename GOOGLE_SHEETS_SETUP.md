# Google Sheets Integration Setup Guide

## Overview
The Feedback component has been modified to submit data directly to Google Sheets using Google Apps Script.

## Setup Steps

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Feedback Submissions" or any name you prefer
4. Add headers in row 1:
   - Column A: Name
   - Column B: Email
   - Column C: Feedback
   - Column D: Timestamp

### 2. Create Google Apps Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Replace the default code with the following **enhanced version**:

```javascript
function doPost(e) {
  try {
    // Log incoming request for debugging
    console.log('Received POST request with parameters:', e.parameter);
    
    // Get the active spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Validate that we have a sheet
    if (!sheet) {
      throw new Error('No active sheet found');
    }
    
    // Get and validate form data
    const name = (e.parameter.name || '').toString().trim();
    const email = (e.parameter.email || '').toString().trim();
    const feedback = (e.parameter.feedback || '').toString().trim();
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    
    // Validate required fields
    if (!feedback) {
      throw new Error('Feedback is required');
    }
    
    if (feedback.length > 1000) {
      throw new Error('Feedback is too long (max 1000 characters)');
    }
    
    // Prepare data for insertion
    const rowData = [
      name || 'Anonymous',
      email || 'No email provided', 
      feedback,
      new Date(timestamp).toLocaleString()
    ];
    
    // Add data to sheet
    sheet.appendRow(rowData);
    
    // Log success
    console.log('Successfully added row:', rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        message: 'Feedback submitted successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error for debugging
    console.error('Error processing feedback submission:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function for manual testing
function testDoPost() {
  const testEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      feedback: 'This is a test feedback message',
      timestamp: new Date().toISOString()
    }
  };
  
  const result = doPost(testEvent);
  console.log('Test result:', result.getContent());
}
```

**Important Notes for this script**:
- Includes comprehensive error handling and logging
- Validates input data before processing
- Provides detailed success/error responses
- Includes a test function for manual verification
- Handles edge cases like missing data

### 3. Deploy the Script
1. Click the **Deploy** button in the Apps Script editor
2. Choose **New deployment**
3. Set type to **Web app**
4. Set execute as: **Me**
5. Set access to: **Anyone** (this allows your website to submit data)
6. Click **Deploy**
7. Copy the **Web app URL** that appears

### 4. Update Your React Component
1. Open `src/app/components/Feedback.tsx`
2. Replace `YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE` with the URL you copied from step 3

Example:
```typescript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

### 5. Test the Integration
1. Start your Next.js development server
2. Navigate to the feedback component
3. Fill out the form and submit
4. Check your Google Sheet to see if the data appears

## Features Added
- **Feedback field** (required): The main feedback content
- **Auto-fetch user data**: Name and email are automatically retrieved from localStorage
- **User info display**: Shows the user whose feedback is being submitted
- **Timestamp**: Automatically added when form is submitted
- **Loading state**: Shows "Submitting..." while processing
- **Success/Error messages**: Provides feedback to users
- **Form validation**: Ensures feedback is not empty
- **Improved styling**: Uses Tailwind CSS for better appearance

## LocalStorage Keys
The component looks for user information in localStorage using these keys:
- **Name**: `userName` or `user_name`
- **Email**: `userEmail` or `user_email`

Make sure your authentication system stores user data with these keys for automatic population.

## Troubleshooting

### Common Issues and Solutions

#### 1. **Permission Errors**
**Issue**: "Script function not found" or "Permission denied"
**Causes**:
- Apps Script not deployed properly
- Wrong execution permissions
- Script not authorized

**Solutions**:
- Ensure deployment type is set to "Web app"
- Set "Execute as" to "Me" (your account)
- Set "Who has access" to "Anyone" (for public access)
- Re-authorize the script if prompted
- Check that you're the owner of both the sheet and script

#### 2. **CORS (Cross-Origin) Errors**
**Issue**: "Access to fetch blocked by CORS policy"
**Causes**:
- Browser blocking cross-origin requests
- Incorrect deployment settings

**Solutions**:
- Ensure the script is deployed as a Web app (not as an API executable)
- Use the Web app URL (ends with `/exec`) not the script editor URL
- Make sure deployment is set to "Anyone" access
- Try accessing the Web app URL directly in browser to test

#### 3. **URL Configuration Issues**
**Issue**: "Failed to fetch" or "Network error"
**Causes**:
- Wrong Google Apps Script URL
- Using spreadsheet URL instead of Web app URL
- Placeholder URL not replaced

**Solutions**:
- Use the Web app deployment URL, not the script editor URL
- Correct format: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
- Don't use the Google Sheets URL (sheets.google.com)
- Replace the placeholder URL in the React component

#### 4. **Script Execution Errors**
**Issue**: Data not appearing in sheets despite "success" message
**Causes**:
- Script targeting wrong sheet
- Incorrect parameter names
- Script execution failures

**Solutions**:
```javascript
// Add error logging to your Apps Script
function doPost(e) {
  try {
    console.log('Received parameters:', e.parameter);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    console.log('Sheet name:', sheet.getName());
    
    // Get form data with fallbacks
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const feedback = e.parameter.feedback || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    
    console.log('Data to append:', [name, email, feedback, timestamp]);
    
    // Add data to sheet
    sheet.appendRow([name, email, feedback, timestamp]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data saved'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Script error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### 5. **Data Format Issues**
**Issue**: Data appears garbled or in wrong columns
**Causes**:
- Mismatch between form data and sheet headers
- Timezone issues with timestamps
- Character encoding problems

**Solutions**:
- Ensure sheet headers match form field names exactly
- Use consistent date formatting
- Add data validation in the script:

```javascript
// Enhanced data validation in Apps Script
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Validate and sanitize inputs
    const name = (e.parameter.name || '').toString().trim();
    const email = (e.parameter.email || '').toString().trim();
    const feedback = (e.parameter.feedback || '').toString().trim();
    const timestamp = new Date().toLocaleString(); // Local timezone
    
    // Check required fields
    if (!feedback) {
      throw new Error('Feedback is required');
    }
    
    // Add data with proper formatting
    sheet.appendRow([name, email, feedback, timestamp]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### 6. **Authentication Issues**
**Issue**: "Authorization required" or script won't run
**Causes**:
- Script requires authorization
- Google account permissions
- Two-factor authentication blocking

**Solutions**:
- Run the script manually once in the editor to authorize
- Check Google account permissions
- Ensure you're logged into the correct Google account
- Clear browser cache and try again

#### 7. **Rate Limiting**
**Issue**: Submissions fail after multiple attempts
**Causes**:
- Google Apps Script execution limits
- Too many requests in short time

**Solutions**:
- Add rate limiting to your frontend
- Implement retry logic with delays
- Use proper error handling

#### 8. **Network and Timeout Issues**
**Issue**: "Request timed out" errors
**Causes**:
- Slow network connection
- Google Services temporarily down
- Script taking too long to execute

**Solutions**:
- Increase timeout in your fetch request
- Add retry mechanism
- Optimize your Apps Script code
- Check Google Workspace Status page

#### 9. **Testing and Debugging**
**Issue**: Can't determine why submissions aren't working
**Solutions**:
- Test the Web app URL directly in browser with parameters
- Check browser developer console for errors
- Enable Google Apps Script logging
- Test with simple data first
- Use Postman or similar tool to test the endpoint

## Quick Diagnostic Steps

If feedback submissions aren't working, follow these steps in order:

### Step 1: Verify Google Sheets Setup
1. **Check sheet headers**: Ensure row 1 has: `Name | Email | Feedback | Timestamp`
2. **Test manual entry**: Manually add a row to verify sheet is writable
3. **Check permissions**: Ensure you own the sheet and can edit it

### Step 2: Test Apps Script
1. **Open Apps Script editor**: Extensions > Apps Script
2. **Run test function**: Execute `testDoPost()` function manually
3. **Check execution log**: View > Logs to see if test worked
4. **Verify authorization**: Grant any requested permissions

### Step 3: Test Web App Deployment
1. **Copy Web app URL**: From deployment (should end with `/exec`)
2. **Test in browser**: Paste URL in browser, should show "Method Not Allowed" (normal)
3. **Test with parameters**: Add `?feedback=test` to URL, should save to sheet

### Step 4: Check Component Configuration
1. **Verify URL**: Ensure `GOOGLE_SHEETS_URL` uses the Web app URL
2. **Check browser console**: Look for network errors or CORS issues
3. **Test with simple data**: Try submitting basic text first

### Step 5: Network and Browser Issues
1. **Try different browser**: Test in incognito/private mode
2. **Check network**: Ensure internet connection is stable
3. **Disable extensions**: Some browser extensions block requests
4. **Clear cache**: Clear browser cache and cookies

### Emergency Debugging
If nothing works, add this temporary debugging to your React component:

```typescript
const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    console.log('Form submitted with data:', {
        feedback: feedback,
        userInfo: userInfo,
        url: GOOGLE_SHEETS_URL
    });
    
    // ... rest of your existing code
};
```

This will help identify what data is being sent and to which URL.

### Testing Checklist

Before going live, test these scenarios:

1. **✅ Basic submission**: Simple feedback with user info
2. **✅ Anonymous submission**: Feedback without user info  
3. **✅ Long feedback**: Test character limits
4. **✅ Special characters**: Test with emojis, quotes, etc.
5. **✅ Network failure**: Test with network disabled
6. **✅ Multiple submissions**: Test rapid consecutive submissions
7. **✅ Empty submission**: Test validation errors
8. **✅ Browser compatibility**: Test in different browsers

### Monitoring and Maintenance

- **Check sheet regularly**: Ensure data is being saved correctly
- **Monitor error logs**: Check browser console and Apps Script logs
- **Backup data**: Regularly export sheet data
- **Update permissions**: Review access permissions periodically
- **Test after changes**: Verify functionality after any modifications

## Security Notes
- The current setup allows anyone to submit to your sheet
- Consider adding rate limiting or authentication for production use
- Be cautious about storing sensitive information in Google Sheets
