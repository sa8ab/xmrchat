import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	// port: Number(process.env.MAIL_PORT),
	ignoreTLS: true,
	auth: {
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
	},
});

function generateOTP() {
	// Declare a digits variable
	// which stores all digits
	const digits = "0123456789";
	let OTP = '';
	const len = digits.length;
	for (let i = 0; i < 20; i++) {
		OTP += digits[Math.floor(Math.random() * len)];
	}

	return OTP;
}

const EmailTemplates: any = {};
EmailTemplates['EMAIL_VERIFICATION'] = (otp: string) => {
	const link = `https://xmrchat.com/auth/email_verification?token=${otp}`;

	const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Please activate your account</title>
        <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
      </head>
      
      <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
        <table role="presentation"
          style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
          <tbody>
            <tr>
              <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                  <tbody>
                    <tr>
                      <td style="padding: 40px 0px 0px;">
                        <div style="text-align: left;">
                          <div style="padding-bottom: 20px;"><img src="https://xmrchat.com/images/xmrchat-logo.png" alt="XMRChat"
                              style="width: 160px;"></div>
                        </div>
                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                          <div style="color: rgb(0, 0, 0); text-align: left;">
                            <h1 style="margin: 1rem 0">Email Verification</h1>
                            <p style="padding-bottom: 16px">Follow this link to verify your email address.</p>
                            <p style="padding-bottom: 16px"><a href="${link}" target="_blank"
                                style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #ff7f0a;display: inline-block;margin: 0.5rem 0;">Confirm
                                now</a></p>
                            <p style="padding-bottom: 16px">If you didn’t ask to verify this address, you can ignore this email.</p>
                            <p style="padding-bottom: 16px">Thanks,<br>The XMRChat team</p>
                          </div>
                        </div>
                        <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                          <p style="padding-bottom: 16px"></p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      
      </html>`;
	const text = link;
	const subject = '👮🏻 XMRChat Email Verification Request';
	return {
		html,
		text,
		subject,
	};
};
EmailTemplates['RESET_PASSWORD'] = (otp: string) => {
	const link = `https://xmrchat.com/auth/reset_password?token=${otp}`;
	const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Please activate your account</title>
    <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
  </head>
  
  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation"
      style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: left;">
                      <div style="padding-bottom: 20px;"><img src="https://xmrchat.com/images/xmrchat-logo.png" alt="XMRChat"
                          style="width: 160px;"></div>
                    </div>
                    <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                      <div style="color: rgb(0, 0, 0); text-align: left;">
                        <h1 style="margin: 1rem 0">Reset Password Request</h1>
                        <p style="padding-bottom: 16px">We've received a request to reset the password for this user account.</p>
                        <p style="padding-bottom: 16px"><a href="${link}" target="_blank"
                            style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #ff7f0a;display: inline-block;margin: 0.5rem 0;">Reset
                            your password</a></p>
                        <p style="padding-bottom: 16px">If you didn't ask to reset your password, you can ignore this email.</p>
                        <p style="padding-bottom: 16px">Thanks,<br>The XMRChat team</p>
                      </div>
                    </div>
                    <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                      <p style="padding-bottom: 16px"></p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  
  </html>`;
	const text = link;
	const subject = '👮🏻 XMRChat Reset Password Request';
	return {
		html,
		text,
		subject,
	};
};

export async function sendOTPMail(mail: string, type = 'EMAIL_VERIFICATION') {
	console.log('welcome to sendOTPMail to send mail to : ', mail);
	const otp = generateOTP();
	const mailConfig = EmailTemplates[type](otp);

	// `The CODE is ${otp.split('').join(" ")}`, // plain text body
	const info = await transporter.sendMail({
		from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address
		to: mail,
		// subject: "OTP CODE 🔐", // Subject line
		subject: mailConfig.subject,
		text: mailConfig.text,
		html: mailConfig.html, // html body
	});

	console.log('mailer info', info, otp);

	return otp;
}
