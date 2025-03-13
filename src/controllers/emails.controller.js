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
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- contact Email ------------------------------------------

export const contactEmail = async (req, res) => {
  try {
    const clientName = decodeURIComponent(req.body.clientName);
    const clientLastName = decodeURIComponent(req.body.clientLastName);
    const clientEmail = decodeURIComponent(req.body.clientEmail);
    const clientPhone = decodeURIComponent(req.body.clientPhone);
    const clientMessage = decodeURIComponent(req.body.clientMessage);

    if (
      !clientName ||
      !clientLastName ||
      !clientPhone ||
      !clientEmail ||
      !clientMessage
    ) {
      return res.status(400).send("Falta enviar datos obligatorios");
    }

    const mailOptions = {
      from: `"${companyEMAIL}" <${UserNODEMAILER}>`,
      replyTo: companyEMAIL,
      to: companyEMAIL,
      subject: `Crabog website`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 16px; background-color: #f9f9f9;">
          <h2 style="color: #8b0000; text-align: center; margin-bottom: 24px;">Mensaje de Contacto</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            Hola <strong>Crabog</strong>, un usuario ha enviado un mensaje desde el formulario de contacto de su sitio web.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
          <h3 style="color: #8b0000;">Detalles del mensaje</h3>
          <ul style="font-size: 15px; line-height: 1.5; list-style: none; padding: 0;">
            <li><strong>Nombre:</strong> ${clientName}</li>
            <li><strong>Apellido:</strong> ${clientLastName}</li>
            <li><strong>Email:</strong> ${clientEmail}</li>
            <li><strong>Telefono:</strong> ${clientPhone}</li>
          </ul>
          <p style="font-size: 16px; line-height: 1.5; margin-top: 16px;">
            <strong>Comentarios:</strong>
          </p>
          <blockquote style="font-size: 15px; line-height: 1.5; color: #555; padding: 12px; background-color: #f0f0f0; border-left: 4px solid #8b0000; margin: 0;">
            ${clientMessage}
          </blockquote>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;">
          <footer style="text-align: center; font-size: 14px; color: #777;">
            <p>Este correo fue generado automáticamente desde el sitio web de <strong>Crabog</strong>.</p>
          </footer>
    </div>
          `,
    };

    await transporter.sendMail(mailOptions);

    res.status(202).send({
      message: `Email enviado correctamente`,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- lawyer Email ------------------------------------------

export const lawyerEmail = async (req, res) => {
  try {
    const lawyerEmail = decodeURIComponent(req.body.lawyerEmail);
    const clientName = decodeURIComponent(req.body.clientName);
    const clientEmail = decodeURIComponent(req.body.clientEmail);
    const clientPhone = decodeURIComponent(req.body.clientPhone);
    const clientMessage = decodeURIComponent(req.body.clientMessage);

    if (
      !lawyerEmail ||
      !clientName ||
      !clientEmail ||
      !clientPhone ||
      !clientMessage
    ) {
      return res.status(400).send("Falta enviar datos obligatorios");
    }

    const mailOptions = {
      from: `"${clientEmail}" <${UserNODEMAILER}>`,
      replyTo: clientEmail,
      to: lawyerEmail,
      subject: `Crabog website`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 16px; background-color: #f9f9f9;">
          <h2 style="color: #8b0000; text-align: center; margin-bottom: 24px;">Mensaje de Contacto</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            Hola, un usuario te ha enviado un mensaje desde el formulario de contacto del sitio web de Crabog.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
          <h3 style="color: #8b0000;">Detalles del mensaje</h3>
          <ul style="font-size: 15px; line-height: 1.5; list-style: none; padding: 0;">
            <li><strong>Nombre:</strong> ${clientName}</li>
            <li><strong>Email:</strong> ${clientEmail}</li>
            <li><strong>Telefono:</strong> ${clientPhone}</li>
          </ul>
          <p style="font-size: 16px; line-height: 1.5; margin-top: 16px;">
            <strong>Comentarios:</strong>
          </p>
          <blockquote style="font-size: 15px; line-height: 1.5; color: #555; padding: 12px; background-color: #f0f0f0; border-left: 4px solid #8b0000; margin: 0;">
            ${clientMessage}
          </blockquote>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;">
          <footer style="text-align: center; font-size: 14px; color: #777;">
            <p>Este correo fue generado automáticamente desde el sitio web de <strong>Crabog</strong>.</p>
          </footer>
    </div>
          `,
    };

    await transporter.sendMail(mailOptions);

    res.status(202).send({
      message: `Email enviado correctamente`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};
