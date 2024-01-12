import nodemailer from 'nodemailer';
// Sengrid Error API key does not start with "SG.". because of that I set dotenv config again in this file..
import dotenv from 'dotenv';
dotenv.config();

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// generate OTP - one time password
export const generateOTP = () => {
  let OTP = '';
  for (let i = 0; i <= 3; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP = OTP + randomValue;
  }
  return OTP;
};

// Defining mail transport by using nodemailer for MAILTRAP
export const mailTransport = () => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
  return transport;
};

// Defining SEND GRID;
export const sendEmail = async (options) => {
  try {
    await sgMail.send({
      from: {
        name: 'Kofi Soft Paha Team',
        email: process.env.SENDGRID_EMAIL_FROM,
      },
      to: options.to,
      subject: options.subject,
      templateId: options.templateId,

      dynamicTemplateData: {
        firstName: options.firstName,
        OTP: options.OTP,
        subject: options.subject,
        url: options.url,
      },
    });
    console.log('Email was sent');
  } catch (error) {
    console.log('Email not sent... An error occured!');
    console.log(error);

    if (error.response) {
      console.log(error.response.body);
    }
  }
};
