export type JobType = {
  applicationEmail: string;
  location: string;
  companyWebsite: string;
  companyName: string;
  companyLinkedInLink?: string;
  companyTagline?: string;
  listingExpiryDate: Date;
  openings: boolean;
  companyImageUrl?: string;
};
