import { FormDataType } from 'src/types/types';
import nodemailer from 'nodemailer';

type SendMailType = {
  text: string;
  html: string;
  subject: string;
  email: string;
  attachments: { filename: string; path: string }[];
};

export const sendMail = async (data: SendMailType) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      logger: true,
    });
    const info = await transporter.sendMail({
      from: `info@aesrecruitment.com`,
      to: 'info@aesrecruitment.com',
      subject: data.subject,
      text: data.text,
      html: data.html,
      attachments: data.attachments,
    });
    return { data: info, status: true };
  } catch (error) {
    console.log(error);
    return { data: null, status: false };
  }
};

export const getTemplate = (
  form: FormDataType,
  filePath: string
): SendMailType => {
  const formType = form.from;

  let text = '',
    html = '',
    attachments = [],
    subject = '';

  switch (formType) {
    case 'home':
      subject = 'Home Page Inquiry';
      text = `Hello,\n\nYou have received a new inquiry from the Home Page.\n\nFrom: ${form.firstName} ${form.lastName} (${form.email})\nPhone: ${form.phoneNumber}\n\nMessage:\n${form.message}\n\nFor Company: ${form.company}\n\nFor Job Title of: ${form.jobTitle}\n\nIn Country: ${form.country}\n\nSubscribed: ${form.subscribe ? 'Yes' : 'No'}\n\nBest regards,\nYour Team`;
      html = `
        <h2>Hello,</h2>
        <p>You have received a new inquiry from the Home Page.</p>
        <p><strong>From:</strong> ${form.firstName} ${form.lastName} (<a href="mailto:${form.email}">${form.email}</a>)</p>
        <p><strong>Phone:</strong> ${form.phoneNumber}</p>
        <p><strong>For Company:</strong> ${form.company}</p>
        <p><strong>For Job Title of:</strong> ${form.jobTitle}</p>
        <p><strong>In Country:</strong> ${form.country}</p>
        <p><strong>Subscribed:</strong> ${form.subscribe ? 'Yes' : 'No'}</p>
        <p><strong>Message:</strong></p>
        <p>${form.message}</p>
        <p>Best regards,<br>Your Team</p>
      `;
      break;

    case 'contact-home-page':
      subject = 'Contact Page Inquiry';
      text = `Hello,\n\nYou have received a new message from the Contact Page.\n\nFrom: ${form.firstName} (${form.email})\n\nFor Company: ${form.company}\n\nMessage:\n${form.message}\n\nBest regards,\nYour Team`;
      html = `
        <h2>Hello,</h2>
        <p>You have received a new message from the Contact Page.</p>
        <p><strong>From:</strong> ${form.firstName} (<a href="mailto:${form.email}">${form.email}</a>)</p>
        <p><strong>For Company:</strong> ${form.company}</p>
        <p><strong>Message:</strong></p>
        <p>${form.message}</p>
        <p>Best regards,<br>Your Team</p>
      `;
      break;

    case 'contact-us-page':
      subject = 'Contact Us Page Inquiry';
      text = `Hello,\n\nYou have received a new message from the Contact Us Page.\n\nFrom: ${form.firstName} (${form.email})\n\nHow did you find us: ${form.howDidYouFindUs}\n\nBest regards,\nYour Team`;
      html = `
        <h2>Hello,</h2>
        <p>You have received a new message from the Contact Us Page.</p>
        <p><strong>From:</strong> ${form.firstName} (<a href="mailto:${form.email}">${form.email}</a>)</p>
        <p><strong>How did you find us:</strong> ${form.howDidYouFindUs}</p>
        <p>Best regards,<br>Your Team</p>
      `;
      break;

    default:
      subject = 'Job Inquiry';
      text = `Hello,\n\nYou have received a new inquiry.\n\nFrom: ${form.firstName} ${form.lastName} (${form.email})\n\nThe resume has been attached.\n\nBest regards,\nYour Team`;
      html = `
        <h2>Hello,</h2>
        <p>You have received a new inquiry.</p>
        <p><strong>From:</strong> ${form.firstName} ${form.lastName} (<a href="mailto:${form.email}">${form.email}</a>)</p>
        <p>The resume has been attached.</p>
        <p>Best regards,<br>Your Team</p>
      `;
      attachments.push({
        filename: 'resume.pdf',
        path: filePath,
      });
      break;
  }

  return {
    text,
    subject,
    html,
    email: form.email,
    attachments,
  };
};
