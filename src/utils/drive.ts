import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
const drive = google.drive({ version: 'v3', auth: oauth2Client });

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const uploadFileToDrive = async (filePath: string, fileName: string) => {
  const fileMetadata = {
    name: fileName,
  };

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
};

export const deleteFileFromDrive = async (fileId: string) => {
  await drive.files.delete({ fileId });
};
