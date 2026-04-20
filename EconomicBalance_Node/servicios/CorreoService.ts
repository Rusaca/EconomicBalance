import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("CorreoService USER:", process.env.EMAIL_USER);
console.log("CorreoService PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // robuxcsgo@gmail.com (real)
    pass: process.env.EMAIL_PASS
  }
});

export const enviarCorreoActivacion = async (correo: string, token: string) => {
  const enlace = `http://localhost:4200/activar?token=${token}`;

 await transporter.sendMail({
  from: `Economic Balance Soporte <economicbalancesoporte@gmail.com>`,
  replyTo: "economicbalancesoporte@gmail.com",
  to: correo,
  subject: 'Activa tu cuenta',
  html: `
  <!DOCTYPE html>
  <html lang="es">
    <body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
              <!-- Título -->
              <tr>
                <td style="font-size:22px; font-weight:bold; color:#333; text-align:center; padding-bottom:10px;">
                  Bienvenido a Economic Balance
                </td>
              </tr>

              <!-- Texto -->
              <tr>
                <td style="font-size:15px; color:#555; line-height:1.6; text-align:center; padding-bottom:25px;">
                  Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón.
                </td>
              </tr>

              <!-- Botón -->
              <tr>
                <td align="center" style="padding-bottom:30px;">
                  <a href="${enlace}"
                    style="background:#4a6cf7; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-size:16px; display:inline-block;">
                    Activar cuenta
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top:35px; font-size:12px; color:#aaa; text-align:center;">
                  © ${new Date().getFullYear()} Economic Balance. Todos los derechos reservados.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
});

};
