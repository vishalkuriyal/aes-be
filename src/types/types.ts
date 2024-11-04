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
  content: string;
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

export type FormDataType = {
  firstName: string;
  lastName?: string;
  company: string;
  jobTitle?: string;
  email: string;
  country?: string;
  message: string;
  phoneNumber?: string;
  subscribe?: boolean;
  howDidYouFindUs?: string;
  from: "home" | "contact-us-page" | "job-board" | 'contact-home-page';
};
