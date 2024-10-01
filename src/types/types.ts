export type JobType = {
  jobPosition: string;
  jobType: "Full Time" | "Part Time" | "Freelance" | "Internship";
  applicationEmailOrUrl: string;
  location: string;
  companyWebsite: string;
  companyName: string;
  companyLinkedIn: string;
  companyTagline: string;
  listingExpiryDate: Date;
  acceptingOpenings: boolean;
  companyImage: File | null;
  salaryRange: {
    min: number;
    max: number;
  }
  currency: "INR" | "USD" | "EUR" | "GBP";
};
