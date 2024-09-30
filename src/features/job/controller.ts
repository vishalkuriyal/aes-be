import { Request, Response } from "express";
import { Job } from "~/models/jobs.model";
import { google } from 'googleapis';
import fs from 'fs';
import dotenv from 'dotenv'
dotenv.config()

// Google Drive API setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Function to upload a file to Google Drive
const uploadFileToDrive = async (filePath: string, fileName: string) => {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

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
    fields: 'id',
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

  const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
  return fileUrl;
};

export const handleGetJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  }
  catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const handleCreateJobs = async (req: Request, res: Response) => {
  try {
    // Ensure the image file is uploaded
    if (!req.file) {
      res.status(400).json({ message: 'Company image is required.' });
    }

    // Extract job details from the request body
    const {
      applicationEmail,
      location,
      companyWebsite,
      companyName,
      companyLinkedIn,
      companyTagline,
      listingExpiryDate,
      acceptingOpenings,
    } = req.body;

    // Upload the company image to Google Drive
    const filePath = req.file.path; // Path of the uploaded file
    const fileName = req.file.originalname; // Original file name
    const companyImageUrl = await uploadFileToDrive(filePath, fileName);

    // Create a new job entry
    const newJob = new Job({
      applicationEmail,
      location,
      companyWebsite,
      companyName,
      companyLinkedIn,
      companyTagline,
      listingExpiryDate,
      acceptingOpenings,
      companyImage: companyImageUrl, // Store the URL of the uploaded image
    });

    // Save the job to MongoDB
    await newJob.save();

    // Delete the local file after uploading
    fs.unlinkSync(filePath);

    res.status(201).json({ message: 'Job created successfully!', job: newJob });
  } catch (error: any) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'An unexpected error occurred.', error: error.message });
  }
}

// // API endpoint for uploading job details
// export const handleUploadJob = async (req: Request, res: Response) => {
//   try {
//     // Ensure the image file is uploaded
//     if (!req.file) {
//       res.status(400).json({ message: 'Company image is required.' });
//       return;
//     }
//
//     // Extract job details from the request body
//     const {
//       applicationEmail,
//       location,
//       companyWebsite,
//       companyName,
//       companyLinkedInLink,
//       companyTagline,
//       listingExpiryDate,
//       acceptingOpenings,
//     } = req.body;
//
//     console.log(req.file)
//
//     // Upload the company image to Google Drive
//     const filePath = req.file.path; // Path of the uploaded file
//     const fileName = req.file.originalname; // Original file name
//     const companyImageUrl = await uploadFileToDrive(filePath, fileName);
//
//     // Create a new job entry
//     const newJob = new Job({
//       applicationEmail,
//       location,
//       companyWebsite,
//       companyName,
//       companyLinkedInLink,
//       companyTagline,
//       listingExpiryDate,
//       acceptingOpenings,
//       companyImageUrl: companyImageUrl, // Store the URL of the uploaded image
//     });
//
//     // Save the job to MongoDB
//     await newJob.save();
//
//     // Delete the local file after uploading
//     fs.unlinkSync(filePath);
//
//     res.status(201).json({ message: 'Job created successfully!', job: newJob });
//   } catch (error: any) {
//     console.error('Error creating job:', error);
//     res.status(500).json({ message: 'An unexpected error occurred.', error: error.message });
//   }
// }
