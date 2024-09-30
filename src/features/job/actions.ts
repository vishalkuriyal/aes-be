import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv'
dotenv.config()


const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const drive = google.drive({ version: 'v3', auth: oauth2Client });


// Function to upload a file to Google Drive
export const uploadFileToDrive = async (filePath: string, fileName: string) => {
  console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  try {
    const fileMetadata = { name: fileName };
    const media = {
      mimeType: 'image/jpeg', // Change this based on the file type
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    // Get the file URL after upload
    const fileId = file.data.id as string;
    drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' }, // Make it publicly accessible
    });

    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
    return fileUrl;
  } catch (error) {
    throw new Error('Error uploading to Google Drive: ' + error);
  }
};
