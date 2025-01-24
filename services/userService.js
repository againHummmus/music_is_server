const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class AuthService {
  async signUp({ email, password, username }) {
    try {
      const { data: existingUserSameEmail } = await supabase
        .from("USser")
        .select("*")
        .eq("email", email)
        .single();

      if (existingUserSameEmail) {
        return {
          error: {
            status: "400",
            message: "User with this email already exists",
          },
          data: null,
        };
      }

      const { data: existingUserSameUserName } = await supabase
        .from("User")
        .select("*")
        .eq("username", username)
        .single();

      if (existingUserSameUserName) {
        return {
          error: {
            status: "400",
            message: "User with this username already exists",
          },
          data: null,
        };
      }

      // Хэшируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создаем нового пользователя
      const response = await supabase
        .from("User")
        .insert([
          {
            email,
            username,
            password_hash: hashedPassword,
          },
        ])
        .select();

      console.log(response);

      if (response.error) {
        return {
          error: {
            status: "500",
            message: error,
          },
          data: null,
        };
      }

      // Создаем JWT токен
      // const token = jwt.sign(
      //   { user_id: response.data[0].id, email },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "24h" }
      // );

      // return {
      //   error: {
      //     status: "200",
      //     message: "Success",
      //   },
      //   data: {
      //     user: data[0],
      //     token,
      //   },
      // };
    } catch (error) {
      return {
        error: {
          status: "500",
          message: error.message || "Internal server error",
        },
        data: null,
      };
    }
  }

  async signIn({ email, password }) {
    try {
      const { data: user } = await supabase
        .from("User")
        .select("*")
        .eq("email", email)
        .single();

      if (!user) {
        return {
          error: {
            status: "404",
            message: "User not found",
          },
          data: null,
        };
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return {
          error: {
            status: "401",
            message: "Invalid password",
          },
          data: null,
        };
      }

      const token = jwt.sign(
        { user_id: user.id, email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return {
        error: {
          status: "200",
          message: "Success",
        },
        data: {
          user,
          token,
        },
      };
    } catch (error) {
      return {
        error: {
          status: "500",
          message: error.message || "Internal server error",
        },
        data: null,
      };
    }
  }

  async checkUser(token) {
    try {
      if (!token) {
        return {
          error: {
            status: "401",
            message: "No token provided",
          },
          data: null,
        };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { data: user, error } = await supabase
        .from("User")
        .select("*")
        .eq("id", decoded.user_id)
        .single();

      if (error || !user) {
        return {
          error: {
            status: "404",
            message: "User not found",
          },
          data: null,
        };
      }

      return {
        error: {
          status: "200",
          message: "Success",
        },
        data: user,
      };
    } catch (error) {
      return {
        error: {
          status: "500",
          message: error.message || "Internal server error",
        },
        data: null,
      };
    }
  }

  async sendResetEmail(email, resetCode) {
    // Создаём «транспорт» — настройки отправки письма
    let transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465, // Порт шифрованного соединения
      secure: true, // Используем TLS
      auth: {
        user: "musicisinfo@mail.ru", // Ваш полный адрес почты Mail.ru
        pass: process.env.MAIL_RU_PASSWORD, // Пароль от почты (либо пароль приложения, если включена двухфакторная аутентификация)
      },
    });

    // Подготавливаем письмо
    try {
      let info = await transporter.sendMail({
        from: '"Yana" <musicisinfo@mail.ru>', // От кого
        to: email, // Кому
        subject: "Тестовое письмо", // Тема письма
        text: "Привет! Это тестовое письмо.", // Текстовая версия письма
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Сброс пароля</h2>
            <p>Вы запросили сброс пароля. Вот ваш код для сброса:</p>
            <div style="background-color: #f5f5f5; padding: 10px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold;">
              ${resetCode}
            </div>
            <p>Этот код действителен в течение 1 часа.</p>
            <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
          </div>
        `,
      });
      console.log(info)
    } catch (e) {
      console.log(e);
    }

  }

  async resetPassword({ email }) {
    try {
      const { data: user, error } = await supabase
        .from("User")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !user) {
        return {
          error: {
            status: "404",
            message: "User not found",
          },
          data: null,
        };
      }

      const resetCode = Math.random().toString(36).slice(-8);
      const resetCodeExpires = new Date(Date.now() + 3600000);

      const { error: updateError } = await supabase
        .from("User")
        .update({
          reset_code: resetCode,
          reset_code_expires: resetCodeExpires,
        })
        .eq("id", user.id);

      if (updateError) {
        return {
          error: {
            status: "500",
            message: "Error updating reset code",
          },
          data: null,
        };
      }

      try {
        await this.sendResetEmail(email, resetCode);

        return {
          error: {
            status: "200",
            message: "Reset code has been sent to your email",
          },
          data: null,
        };
      } catch (emailError) {
        console.log(emailError);
        // Если отправка email не удалась, откатываем изменения в базе
        await supabase
          .from("User")
          .update({
            reset_code: null,
            reset_code_expires: null,
          })
          .eq("id", user.id);

        return {
          error: {
            status: "500",
            message: "Failed to send reset code email",
          },
          data: null,
        };
      }
    } catch (error) {
      return {
        error: {
          status: "500",
          message: error.message || "Internal server error",
        },
        data: null,
      };
    }
  }

  async updatePassword({ email, resetCode, newPassword }) {
    try {
      const { data: user, error } = await supabase
        .from("User")
        .select("*")
        .eq("email", email)
        .eq("reset_code", resetCode)
        .single();

      if (error || !user) {
        return {
          error: {
            status: "400",
            message: "Invalid reset code",
          },
          data: null,
        };
      }

      if (new Date() > new Date(user.reset_code_expires)) {
        return {
          error: {
            status: "400",
            message: "Reset code has expired",
          },
          data: null,
        };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const { error: updateError } = await supabase
        .from("User")
        .update({
          password: hashedPassword,
          reset_code: null,
          reset_code_expires: null,
        })
        .eq("id", user.id);

      if (updateError) {
        return {
          error: {
            status: "500",
            message: "Error updating password",
          },
          data: null,
        };
      }

      return {
        error: {
          status: "200",
          message: "Password has been updated successfully",
        },
        data: null,
      };
    } catch (error) {
      return {
        error: {
          status: "500",
          message: error.message || "Internal server error",
        },
        data: null,
      };
    }
  }
}

module.exports = new AuthService();
