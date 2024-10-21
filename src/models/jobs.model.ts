import mongoose, { Schema } from 'mongoose';
import { JobType } from '../types/types';

const jobSchema = new Schema<JobType>(
  {
    applicationEmailOrUrl: { type: String, required: true },
    location: { type: String, required: true },
    companyWebsite: { type: String, required: true },
    companyName: { type: String, required: true },
    companyLinkedIn: { type: String },
    companyTagline: { type: String },
    listingExpiryDate: { type: Date, required: true },
    acceptingOpenings: { type: Boolean, required: true, default: true },
    companyImage: { type: String },
    jobType: { type: String, required: true },
    currency: { type: String, required: true },
    jobPosition: { type: String, required: true },
    salaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    content: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model<JobType>('Job', jobSchema);
