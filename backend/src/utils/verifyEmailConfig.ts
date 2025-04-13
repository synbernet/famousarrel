import nodemailer from 'nodemailer';

export const verifyEmailConfig = async () => {
  const requiredEnvVars = [
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'EMAIL_FROM',
    'ADMIN_EMAIL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.map(v => v.replace('_PASS', '_***')));
    return false;
  }

  try {
    // Validate email format for FROM and ADMIN email
    const emailRegex = /^\S+@\S+\.\S+$/;
    const fromEmail = process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || process.env.EMAIL_FROM;
    
    if (!emailRegex.test(fromEmail) || !emailRegex.test(process.env.ADMIN_EMAIL || '')) {
      console.error('Invalid email format in configuration');
      return false;
    }

    // Validate port number
    const port = parseInt(process.env.EMAIL_PORT || '587');
    if (isNaN(port) || port < 1 || port > 65535) {
      console.error('Invalid email port number');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    // Remove sensitive information from error logs
    console.error('Email configuration error - Please check your settings');
    return false;
  }
}; 