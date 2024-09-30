import mongoose, { Schema } from 'mongoose';
import { JobType } from '~/types/types';

const jobSchema = new Schema<JobType>({
  applicationEmail: { type: String, required: true },
  location: { type: String, required: true },
  companyWebsite: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLinkedInLink: { type: String },
  companyTagline: { type: String },
  listingExpiryDate: { type: Date, required: true },
  openings: { type: Boolean, required: true, default: true },
  companyImageUrl: { type: String },
});

export const Job = mongoose.model<JobType>('Job', jobSchema);
