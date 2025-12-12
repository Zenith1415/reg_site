import nodemailer from 'nodemailer';
import { TeamRegistration } from '../types/index.js';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) {
    return transporter;
  }

  // If no SMTP credentials provided, create Ethereal test account
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 Creating Ethereal test email account...');
    const testAccount = await nodemailer.createTestAccount();
    
    console.log(`
    📬 Ethereal Test Email Account Created:
    ────────────────────────────────────────
    User: ${testAccount.user}
    Pass: ${testAccount.pass}
    
    View sent emails at: https://ethereal.email
    Login with the credentials above to see emails
    ────────────────────────────────────────
    `);

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    return transporter;
  }

  // Use provided SMTP credentials
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

/**
 * Send confirmation email to team leader
 */
export async function sendConfirmationEmail(registration: TeamRegistration): Promise<void> {
  const transport = await getTransporter();

  const membersList = registration.teamMembers
    .map((m) => `<li><strong>${m.name}</strong>${m.role ? ` (${m.role})` : ''} - ${m.email}</li>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
                🎉 Registration Confirmed!
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                Welcome to the Team Registration Platform
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Hello <strong>${registration.teamLeaderName}</strong>,
              </p>
              <p style="margin: 0 0 30px; color: #64748b; font-size: 16px; line-height: 1.6;">
                Your team has been successfully registered on our platform. Below are your registration details:
              </p>
              
              <!-- Team ID Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 24px; border-radius: 12px; text-align: center;">
                    <p style="margin: 0 0 8px; color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Your Unique Team ID
                    </p>
                    <p style="margin: 0; color: white; font-size: 28px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
                      ${registration.teamId}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Details Table -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 14px;">Team Name</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <strong style="color: #334155; font-size: 14px;">${registration.teamName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 14px;">Team Leader</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <strong style="color: #334155; font-size: 14px;">${registration.teamLeaderName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 14px;">Email</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <strong style="color: #334155; font-size: 14px;">${registration.teamLeaderEmail}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 14px;">ID Verification</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="display: inline-block; padding: 4px 12px; background: ${registration.idCardVerified ? '#dcfce7' : '#fef3c7'}; color: ${registration.idCardVerified ? '#166534' : '#92400e'}; border-radius: 20px; font-size: 12px; font-weight: 600;">
                      ${registration.idCardVerified ? '✓ Verified' : 'Pending'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #64748b; font-size: 14px;">Registered On</span>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <strong style="color: #334155; font-size: 14px;">${new Date(registration.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</strong>
                  </td>
                </tr>
              </table>
              
              ${registration.teamMembers.length > 0 ? `
              <!-- Team Members -->
              <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                <p style="margin: 0 0 12px; color: #334155; font-size: 14px; font-weight: 600;">
                  Team Members (${registration.teamMembers.length})
                </p>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #64748b; font-size: 14px; line-height: 1.8;">
                  ${membersList}
                </ul>
              </div>
              ` : ''}
              
              <!-- Important Note -->
              <div style="background: #fef3c7; padding: 16px 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>Important:</strong> Please save your Team ID. You will need it for future reference and event participation.
                </p>
              </div>
              
              <!-- Footer -->
              <p style="margin: 30px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                If you have any questions, feel free to contact our support team.
              </p>
              <p style="margin: 20px 0 0; color: #334155; font-size: 14px;">
                Best regards,<br>
                <strong>The Team Registration Platform</strong>
              </p>
            </td>
          </tr>
          
          <!-- Bottom Footer -->
          <tr>
            <td style="padding: 20px; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} Team Registration Platform. All rights reserved.
              </p>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Team Registration Platform" <${process.env.SMTP_FROM || 'noreply@teamreg.com'}>`,
    to: registration.teamLeaderEmail,
    subject: `✅ Team Registration Confirmed - ${registration.teamId}`,
    html,
    text: `
Team Registration Confirmed!

Hello ${registration.teamLeaderName},

Your team has been successfully registered.

Team ID: ${registration.teamId}
Team Name: ${registration.teamName}
Team Leader: ${registration.teamLeaderName}
Email: ${registration.teamLeaderEmail}
ID Verification: ${registration.idCardVerified ? 'Verified' : 'Pending'}
Registered On: ${new Date(registration.createdAt).toLocaleString()}

${registration.teamMembers.length > 0 ? `
Team Members:
${registration.teamMembers.map(m => `- ${m.name}${m.role ? ` (${m.role})` : ''} - ${m.email}`).join('\n')}
` : ''}

Please save your Team ID for future reference.

Best regards,
The Team Registration Platform
    `.trim(),
  };

  const info = await transport.sendMail(mailOptions);
  
  // Log preview URL for Ethereal emails
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`📧 Preview email at: ${previewUrl}`);
  }
}
