const nodemailer = require("nodemailer");
const { createClient } = require("@supabase/supabase-js");

class MailService {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    this.transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.MAIL_RU_EMAIL_REF}@mail.ru`,
        pass: process.env.MAIL_RU_PASSWORD,
      },
    });
  }

  async sendActivationLink(to, link) {
    try {
      await this.transporter.sendMail({
        from: `"MusicIs" <${process.env.MAIL_RU_EMAIL_REF}@mail.ru>`,
        to,
        subject: "Account Activation on MusicIs",
        text: "",
        html: `
          <div>
            <h1>To activate your account, please follow the link</h1>
            <a href="${link}">${link}</a>
          </div>
        `,
      });
    } catch (error) {
      throw new Error("Error sending activation link: " + error.message);
    }
  }

  async sendResetEmail(email, resetCode) {
    try {
      await this.transporter.sendMail({
        from: `"MusicIs" <${process.env.MAIL_RU_EMAIL_REF}@mail.ru>`,
        to: email,
        subject: "Password Reset",
        text: "Hello! This email is about password reset.",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset</h2>
            <p>You have requested a password reset. Here is your reset code:</p>
            <div style="background-color: #f5f5f5; padding: 10px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold;">
              ${resetCode}
            </div>
            <p>This code is valid for 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
        `,
      });
    } catch (e) {
      console.log(e);
      throw new Error("Error sending reset email: " + e.message);
    }
  }

  async resetPassword({ email }) {
    const { data: user, error: userError } = await this.supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user) {
      throw new Error("No user found");
    }

    const resetCode = Math.random().toString(36).slice(-8);
    const resetCodeExpires = new Date(Date.now() + 3600000);

    const { data, error } = await this.supabase
      .from("User")
      .update({
        reset_code: resetCode,
        reset_code_expires: resetCodeExpires,
      })
      .eq("id", user.id);

    if (error) {
      throw new Error("Error updating reset code: " + error.message);
    }

    await this.sendResetEmail(email, resetCode);

    return data;
  }
}

module.exports = new MailService();
