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
  companyImage: string;
  salaryRange: {
    min: number;
    max: number;
  }
  currency: "INR" | "USD" | "EUR" | "GBP";
};

export type BlogType = {
  title: String;
  content: String;
  description: String;
  subDescription: String;
  image: string;
  author: String;
  date: Date;
  tags: [String];
}
