import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = 'https://www.aesrecruitment.com/oauth2callback';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Set the initial credentials
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Automatically refresh the access token on expiration
oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    console.log('New refresh token received:', tokens.refresh_token);
    // Optionally, save the new refresh token to a secure location (e.g., environment variable or database)
  }
  console.log('Access token refreshed.');
});

const refreshAccessToken = async () => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    console.log('Access token refreshed manually:', credentials.access_token);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Unable to refresh access token.');
  }
};

// Upload a file to Google Drive
export const uploadFileToDrive = async (
  filePath: string,
  fileName: string
): Promise<string> => {
  try {
    const fileMetadata = { name: fileName };
    const media = {
      mimeType: 'image/png', // Set the appropriate mime type for your file
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = file.data.id as string;

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    return fileUrl;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.log('Access token expired, refreshing...');
      await refreshAccessToken();
      return uploadFileToDrive(filePath, fileName); // Retry after refreshing token
    }
    console.error('Error uploading file to Drive:', error);
    throw error;
  }
};

// Delete a file from Google Drive
export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  try {
    await drive.files.delete({ fileId });
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.log('Access token expired, refreshing...');
      await refreshAccessToken();
      return deleteFileFromDrive(fileId); // Retry after refreshing token
    }
    console.error('Error deleting file from Drive:', error);
    throw error;
  }
};
