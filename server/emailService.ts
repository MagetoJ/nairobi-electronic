import nodemailer from 'nodemailer';

// Email configuration using Gmail SMTP
// For production, you would use App Passwords: https://support.google.com/accounts/answer/185833
let transporter: nodemailer.Transporter | null = null;

export function initializeEmailService() {
  // Use Gmail SMTP - requires app password for security
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
    },
  });

  return transporter;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!transporter) {
    transporter = initializeEmailService();
  }

  const mailOptions = {
    from: `"Nairobi Electronics" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  const subject = 'Welcome to Nairobi Electronics!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3b82f6;">Welcome to Nairobi Electronics!</h1>
      <p>Hi ${firstName},</p>
      <p>Thank you for joining Nairobi Electronics! We're excited to have you as part of our community.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse our latest electronics and gadgets</li>
        <li>Enjoy cash-on-delivery payment options</li>
        <li>Get fast delivery across Kenya</li>
        <li>Access exclusive deals and offers</li>
      </ul>
      <p>Start shopping today and discover amazing technology at unbeatable prices!</p>
      <p style="margin-top: 30px;">
        <a href="https://nairobi-electronics.replit.app" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Start Shopping
        </a>
      </p>
      <p style="color: #666; margin-top: 30px;">
        Best regards,<br>
        The Nairobi Electronics Team<br>
        10 Woodvale Grove, Nairobi<br>
        Phone: 0717888333
      </p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendOrderDispatchEmail(
  to: string, 
  firstName: string, 
  orderId: string,
  shippingAddress: string
) {
  const subject = 'Your Order Has Been Dispatched! 📦';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3b82f6;">Your Order is On Its Way! 🚚</h1>
      <p>Hi ${firstName},</p>
      <p>Great news! Your order <strong>#${orderId.split('-')[0]}...</strong> has been dispatched from our Nairobi store and is on its way to you!</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Delivery Details:</h3>
        <p><strong>Delivery Address:</strong><br>${shippingAddress}</p>
        <p><strong>Expected Delivery:</strong> Within 1-2 business days</p>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
      </div>

      <p><strong>What to expect:</strong></p>
      <ul>
        <li>Our delivery team will contact you before arrival</li>
        <li>Have your cash ready for payment</li>
        <li>Inspect your items before payment</li>
        <li>Keep this email as your delivery reference</li>
      </ul>

      <p>If you have any questions about your delivery, please contact us at 0717888333.</p>

      <p style="color: #666; margin-top: 30px;">
        Thank you for choosing Nairobi Electronics!<br><br>
        Best regards,<br>
        The Nairobi Electronics Team<br>
        10 Woodvale Grove, Nairobi<br>
        Phone: 0717888333
      </p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}