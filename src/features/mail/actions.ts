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
      subject = 'Home Page';
      text = `From: ${form.firstName} ${form.lastName} (${form.email})\n\n${form.message}`;
      html = `<p>From: ${form.firstName} ${form.lastName} (${form.email})</p><p>${form.message}</p>`;
      break;

    case 'contact-home-page':
      subject = 'Contact Page';
      text = `From: ${form.firstName} (${form.email})\n\n${form.message}`;
      html = `<p>From: ${form.firstName} (${form.email})</p><p>${form.message}</p>`;
      break;

    case 'contact-us-page':
      subject = 'Contact Page';
      text = `From: ${form.firstName} (${form.email})\n\n How did you find us: ${form.howDidYouFindUs}`;
      html = `<p>From: ${form.firstName} (${form.email})</p><p>How did you find us: ${form.howDidYouFindUs}</p>`;
      break;

    default:
      subject = 'Contact Page';
      text = `From: ${form.firstName} (${form.email})\n\n${form.message}`;
      html = `<p>From: ${form.firstName} (${form.email})</p><p>${form.message}</p>`;
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
