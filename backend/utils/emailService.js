const brevo = require('@getbrevo/brevo');

// Initialize Brevo API client
let apiInstance = null;

const initializeBrevo = () => {
    if (!apiInstance) {
        apiInstance = new brevo.TransactionalEmailsApi();
        const apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
    }
    return apiInstance;
};

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email using Brevo
 * @param {string} toEmail - Recipient email address
 * @param {string} toName - Recipient name
 * @param {string} otp - 6-digit OTP code
 */
const sendOTPEmail = async (toEmail, toName, otp) => {
    try {
        const api = initializeBrevo();

        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: process.env.EMAIL_FROM_NAME || 'FitLife Pro',
            email: process.env.EMAIL_FROM || 'noreply@fitlifepro.com'
        };

        sendSmtpEmail.to = [{
            email: toEmail,
            name: toName
        }];

        sendSmtpEmail.subject = 'Verify Your FitLife Pro Account';

        // HTML Email Template
        sendSmtpEmail.htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .content {
            background: white;
            padding: 40px 30px;
            border-radius: 15px;
            text-align: center;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 24px;
        }
        .otp-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 36px;
            font-weight: bold;
            padding: 20px;
            border-radius: 10px;
            letter-spacing: 8px;
            margin: 30px 0;
            display: inline-block;
        }
        .message {
            color: #666;
            font-size: 16px;
            margin: 20px 0;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 5px;
            color: #856404;
            font-size: 14px;
        }
        .footer {
            color: white;
            margin-top: 30px;
            font-size: 14px;
            text-align: center;
        }
        .footer a {
            color: white;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="logo">💪 FitLife Pro</div>
            <h1>Welcome to FitLife Pro!</h1>
            <p class="message">Hi ${toName},</p>
            <p class="message">Thank you for registering with FitLife Pro. To complete your registration, please verify your email address using the OTP below:</p>
            
            <div class="otp-box">${otp}</div>
            
            <p class="message">This OTP is valid for <strong>5 minutes</strong>.</p>
            
            <div class="warning">
                ⚠️ If you didn't request this verification, please ignore this email.
            </div>
        </div>
        
        <div class="footer">
            <p>🏋️ Get fit. Stay healthy. Live better.</p>
            <p style="font-size: 12px; margin-top: 15px;">
                This is an automated message from FitLife Pro.<br>
                Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
        `;

        // Text version for email clients that don't support HTML
        sendSmtpEmail.textContent = `
Welcome to FitLife Pro!

Hi ${toName},

Thank you for registering with FitLife Pro. To complete your registration, please verify your email address using the OTP below:

OTP: ${otp}

This OTP is valid for 5 minutes.

If you didn't request this verification, please ignore this email.

---
FitLife Pro - Get fit. Stay healthy. Live better.
        `;

        const result = await api.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent successfully to:', toEmail);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};

/**
 * Send welcome email after successful verification
 */
const sendWelcomeEmail = async (toEmail, toName) => {
    try {
        const api = initializeBrevo();

        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: process.env.EMAIL_FROM_NAME || 'FitLife Pro',
            email: process.env.EMAIL_FROM || 'noreply@fitlifepro.com'
        };

        sendSmtpEmail.to = [{
            email: toEmail,
            name: toName
        }];

        sendSmtpEmail.subject = 'Welcome to FitLife Pro! 🎉';

        sendSmtpEmail.htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
        .content { padding: 20px; background: #f9f9f9; border-radius: 10px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to FitLife Pro!</h1>
        </div>
        <div class="content">
            <p>Hi ${toName},</p>
            <p>Congratulations! Your email has been verified successfully.</p>
            <p>You're now ready to start your fitness journey with personalized workout and diet plans!</p>
            <p><strong>What you can do:</strong></p>
            <ul>
                <li>🏋️ Generate custom workout plans</li>
                <li>🥗 Create personalized diet plans</li>
                <li>📊 Track your progress with analytics</li>
                <li>⏱️ Use workout timers</li>
            </ul>
            <p>Let's get started and achieve your fitness goals together!</p>
        </div>
    </div>
</body>
</html>
        `;

        await api.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Welcome email sent to:', toEmail);

    } catch (error) {
        console.error('⚠️ Warning: Failed to send welcome email:', error);
        // Don't throw error - welcome email is not critical
    }
};

/**
 * Send feedback email to admin
 * @param {string} fromName - Sender's name
 * @param {string} fromEmail - Sender's email
 * @param {string} message - Feedback message
 */
const sendFeedbackEmail = async (fromName, fromEmail, message) => {
    try {
        const api = initializeBrevo();

        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: process.env.EMAIL_FROM_NAME || 'FitLife Pro',
            email: process.env.EMAIL_FROM || 'noreply@fitlifepro.com'
        };

        sendSmtpEmail.to = [{
            email: 'swork2814@gmail.com',
            name: 'FitLife Pro Admin'
        }];

        sendSmtpEmail.replyTo = {
            email: fromEmail,
            name: fromName
        };

        sendSmtpEmail.subject = `New Feedback from ${fromName}`;

        sendSmtpEmail.htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; }
        .content { padding: 20px; background: #f9f9f9; border-radius: 10px; margin-top: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 New User Feedback</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From:</div>
                <div class="value">${fromName} (${fromEmail})</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        await api.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Feedback email sent from:', fromEmail);
        return { success: true };

    } catch (error) {
        console.error('❌ Error sending feedback email:', error);
        throw new Error('Failed to send feedback email');
    }
};

module.exports = {
    generateOTP,
    sendOTPEmail,
    sendWelcomeEmail,
    sendFeedbackEmail
};
