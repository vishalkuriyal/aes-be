import { Request, Response } from "express";
import { Job } from "~/models/jobs.model";
import fs from 'fs';
import dotenv from 'dotenv'
import { uploadFileToDrive } from "./actions";
import { JobType } from "~/types/types";
dotenv.config()

// Google Drive API setup
export const handleGetJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  }
  catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const handleCreateJobs = async (req: Request<{}, {}, JobType>, res: Response) => {
  try {
    // Ensure the image file is uploaded
    if (!req.file) {
      res.status(400).json({ message: 'Company image is required.' });
      return
    }

    // Extract job details from the request body
    const {
      location,
      companyWebsite,
      companyName,
      companyLinkedIn,
      companyTagline,
      listingExpiryDate,
      acceptingOpenings,
      jobType,
      currency,
      jobPosition,
      salaryRange,
      applicationEmailOrUrl
    } = req.body;

    const { min, max } = salaryRange;

    // Upload the company image to Google Drive
    const filePath = req.file.path; // Path of the uploaded file
    const fileName = req.file.originalname; // Original file name
    const companyImageUrl = await uploadFileToDrive(filePath, fileName);

    // Create a new job entry
    const newJob = new Job({
      applicationEmailOrUrl,
      jobPosition,
      currency,
      jobType,
      salaryRange: {
        min,
        max
      },
      companyImage: companyImageUrl,
      location,
      companyWebsite,
      companyName,
      companyLinkedIn,
      companyTagline,
      listingExpiryDate,
      acceptingOpenings,
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

export const handleDeleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: 'Job deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}
