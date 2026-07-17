import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  productType: string;
  quantity: string;
  details: string;
  timeline?: string;
}

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@infinitymarbledesign.com';

    // Email to admin
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: `New Quotation Request from ${body.name}`,
      html: `
        <h2>New Quotation Request</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        ${body.company ? `<p><strong>Company:</strong> ${body.company}</p>` : ''}
        <p><strong>Product Type:</strong> ${body.productType}</p>
        <p><strong>Quantity:</strong> ${body.quantity}</p>
        <p><strong>Timeline:</strong> ${body.timeline || 'Not specified'}</p>
        <p><strong>Details:</strong></p>
        <p>${body.details.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.SMTP_USER,
      to: body.email,
      subject: 'Your Quotation Request - Infinity Marble Design',
      html: `
        <h2>Thank you for your quotation request!</h2>
        <p>Dear ${body.name},</p>
        <p>We have received your quotation request for ${body.productType}.</p>
        <p>Our team will review your request and contact you shortly at ${body.phone} or ${body.email}.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li>Product Type: ${body.productType}</li>
          <li>Quantity: ${body.quantity}</li>
          <li>Timeline: ${body.timeline || 'Not specified'}</li>
        </ul>
        <p>Best regards,<br>Infinity Marble Design Team</p>
      `,
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      {
        success: true,
        message: 'Quotation request sent successfully! Check your email for confirmation.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
