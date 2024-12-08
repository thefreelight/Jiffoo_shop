import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    console.log('Attempting to send welcome email to:', email);
    console.log('Using Resend API key length:', process.env.RESEND_API_KEY?.length);
    
    const data = await resend.emails.send({
      from: 'Jiffoo <support@jiffoo.com>',
      to: email,
      replyTo: 'support@jiffoo.com',
      subject: 'Welcome to Jiffoo - Access Your Source Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0aa6fd;">Welcome to Jiffoo! 🎉</h1>
          <p>Hi ${name},</p>
          <p>Thank you for your purchase! You now have lifetime access to the NavToAI source code.</p>
          <p>You should receive a GitHub repository invitation shortly in a separate email. Please accept it to access the code.</p>
          <p>If you don't receive the GitHub invitation within 5 minutes, please check your spam folder or contact our support team.</p>
          <div style="margin: 30px 0;">
            <p>Here are your next steps:</p>
            <ol>
              <li>Accept the GitHub repository invitation (coming in a separate email)</li>
              <li>Clone the repository</li>
              <li>Follow the setup instructions in the README.md file</li>
            </ol>
          </div>
          <p>If you need any help, don't hesitate to reach out to our support team.</p>
          <p>Best regards,<br>The Jiffoo Team</p>
        </div>
      `,
    });
    
    if (data.error) {
      console.error('Error response from Resend:', data.error);
      throw new Error(`Resend API error: ${data.error.message}`);
    }
    
    console.log('Welcome email sent successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Detailed error sending welcome email:', {
      error: error,
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    throw error;
  }
}

export async function sendGitHubInvitationEmail(email: string, name: string, repoUrl: string) {
  try {
    console.log('Attempting to send GitHub invitation email to:', email);
    
    const data = await resend.emails.send({
      from: 'Jiffoo <support@jiffoo.com>',
      to: email,
      replyTo: 'support@jiffoo.com',
      subject: 'Your GitHub Repository Access',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0aa6fd;">GitHub Repository Access</h1>
          <p>Hi ${name},</p>
          <p>You've been invited to access the NavToAI source code repository.</p>
          <p>You should receive a GitHub invitation email shortly. Please accept it to gain access to the repository.</p>
          <p>Once accepted, you can access the repository at:</p>
          <p><a href="${repoUrl}" style="color: #0aa6fd;">${repoUrl}</a></p>
          <div style="margin: 30px 0;">
            <p>Quick setup guide:</p>
            <ol>
              <li>Accept the GitHub invitation</li>
              <li>Clone the repository using:<br>
                <code style="background: #f5f5f5; padding: 5px; display: block; margin: 10px 0;">
                  git clone ${repoUrl}
                </code>
              </li>
              <li>Follow the setup instructions in the README.md file</li>
            </ol>
          </div>
          <p>If you need any help, our support team is here to assist you.</p>
          <p>Best regards,<br>The Jiffoo Team</p>
        </div>
      `,
    });
    
    if (data.error) {
      console.error('Error response from Resend:', data.error);
      throw new Error(`Resend API error: ${data.error.message}`);
    }
    
    console.log('GitHub invitation email sent successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Detailed error sending GitHub invitation email:', {
      error: error,
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    throw error;
  }
}

export async function sendGitHubUsernameRequestEmail(email: string, name: string) {
  try {
    console.log('Attempting to send GitHub username request email to:', email);
    
    const data = await resend.emails.send({
      from: 'Jiffoo <support@jiffoo.com>',
      to: email,
      replyTo: 'support@jiffoo.com',
      subject: 'Action Required: Provide Your GitHub Username',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0aa6fd;">Action Required</h1>
          <p>Hi ${name},</p>
          <p>We couldn't find a GitHub account associated with your email address (${email}).</p>
          <p>To get access to the source code repository, please:</p>
          <ol>
            <li>Make sure you have a GitHub account</li>
            <li>Add ${email} to your GitHub account, or</li>
            <li>Reply to this email with your GitHub username</li>
          </ol>
          <p>Once we have your GitHub information, we'll send you the repository invitation.</p>
          <p>Best regards,<br>The Jiffoo Team</p>
        </div>
      `,
    });
    
    if (data.error) {
      console.error('Error response from Resend:', data.error);
      throw new Error(`Resend API error: ${data.error.message}`);
    }
    
    console.log('GitHub username request email sent successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Detailed error sending GitHub username request email:', {
      error: error,
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    throw error;
  }
} 