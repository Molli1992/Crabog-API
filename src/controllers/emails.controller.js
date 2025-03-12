import { pool } from "../db.js";
import nodemailer from "nodemailer";
import { UserNODEMAILER, PassNODEMAILER, companyEMAIL } from "../config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: UserNODEMAILER,
    pass: PassNODEMAILER,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ---------------------------------------- emailResetPassword ------------------------------------------

export const emailResetPassword = async (req, res) => {
  try {
    const userEmail = decodeURIComponent(req.body.userEmail);

    if (!userEmail) {
      return res.status(400).send("Falta enviar datos obligatorios");
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      userEmail,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: `No existe el usuario con email: ${userEmail}` });
    }

    const mailOptions = {
      from: `"${companyEMAIL}" <${UserNODEMAILER}>`,
      replyTo: companyEMAIL,
      to: userEmail,
      subject: `Restablecer contraseña Crabog`,
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
      <h1 style="color: #333;">Crabog</h1>
      <h2 style="color: #333;">Restablece tu contraseña</h2>
      <p style="color: #555; font-size: 16px;">
        Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:
      </p>
      <a href="${process.env.WEB_URL}/admin/resetPassword/${encodeURIComponent(
        userEmail
      )}" 
         style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Restablecer Contraseña
      </a>
      <p style="color: #555; font-size: 14px; margin-top: 20px;">
        Si no solicitaste este cambio, ignora este correo.
      </p>
    </div>
          `,
    };

    await transporter.sendMail(mailOptions);

    res.status(202).send({
      message: `Te enviamos un email a ${userEmail} para restablecer tu contraseña`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};
