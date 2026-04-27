import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("CorreoService USER:", process.env.EMAIL_USER);
console.log("CorreoService PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
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

              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                <!-- LOGO -->
                <tr>
                  <td align="center" style="padding-bottom:25px;">
                    <img src="https://raw.githubusercontent.com/Rusaca/EconomicBalance/master/EconomicBalance_Angular/public/Logo.png"
                         alt="Economic Balance"
                         width="140"
                         style="display:block; margin:auto;">
                  </td>
                </tr>

                <!-- TÍTULO -->
                <tr>
                  <td style="font-size:22px; font-weight:bold; color:#333; text-align:center; padding-bottom:10px;">
                    Bienvenido a Economic Balance
                  </td>
                </tr>

                <!-- TEXTO PRINCIPAL -->
                <tr>
                  <td style="font-size:15px; color:#555; line-height:1.6; text-align:center; padding-bottom:25px;">
                    Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón.
                  </td>
                </tr>

                <!-- BOTÓN -->
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <a href="${enlace}"
                      style="background:#4a6cf7; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-size:16px; display:inline-block;">
                      Activar cuenta
                    </a>
                  </td>
                </tr>

                <!-- SEPARADOR -->
                <tr>
                  <td style="border-top:1px solid #e5e5e5; padding-top:25px;"></td>
                </tr>

               
                <!-- FOOTER -->
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


export const enviarCorreoRecuperacion = async (correo: string, enlace: string) => {
  console.log('ENVIANDO CORREO A:', correo);
  console.log('ENLACE:', enlace);

  const info = await transporter.sendMail({
    from: `Economic Balance Soporte <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to: correo,
    subject: 'Recupera tu contraseña',
    html: `
    <!DOCTYPE html>
    <html lang="es">
      <body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">

              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                <!-- LOGO -->
                <tr>
                  <td align="center" style="padding-bottom:25px;">
                    <img src="https://raw.githubusercontent.com/Rusaca/EconomicBalance/master/EconomicBalance_Angular/public/Logo.png"
                         alt="Economic Balance"
                         width="140"
                         style="display:block; margin:auto;">
                  </td>
                </tr>

                <!-- TÍTULO -->
                <tr>
                  <td style="font-size:22px; font-weight:bold; color:#333; text-align:center; padding-bottom:10px;">
                    Recupera tu contraseña
                  </td>
                </tr>

                <!-- TEXTO PRINCIPAL -->
                <tr>
                  <td style="font-size:15px; color:#555; line-height:1.6; text-align:center; padding-bottom:25px;">
                    Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Economic Balance.
                    Si has sido tú, haz clic en el siguiente botón.
                  </td>
                </tr>

                <!-- BOTÓN -->
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <a href="${enlace}"
                      style="background:#4a6cf7; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-size:16px; display:inline-block;">
                      Recuperar contraseña
                    </a>
                  </td>
                </tr>

                <!-- TEXTO SECUNDARIO -->
                <tr>
                  <td style="font-size:13px; color:#777; line-height:1.5; text-align:center; padding-bottom:10px;">
                    Si no solicitaste este cambio, puedes ignorar este correo sin problema.
                  </td>
                </tr>

                <!-- FOOTER -->
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

  console.log('INFO SENDMAIL:', info);

  return info;
};




export const enviarCorreoBienvenida = async (correo: string, nombre: string) => {
  await transporter.sendMail({
    from: `Economic Balance Soporte <economicbalancesoporte@gmail.com>`,
    to: correo,
    subject: '¡Bienvenido a Economic Balance!',
    html: `
    <!DOCTYPE html>
    <html lang="es">
      <body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">

              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                <!-- LOGO -->
                <tr>
                  <td align="center" style="padding-bottom:25px;">
                    <img src="https://raw.githubusercontent.com/Rusaca/EconomicBalance/master/EconomicBalance_Angular/public/Logo.png"
                         alt="Economic Balance"
                         width="140"
                         style="display:block; margin:auto;">
                  </td>
                </tr>

                <!-- TÍTULO -->
                <tr>
                  <td style="font-size:24px; font-weight:bold; color:#333; text-align:center;">
                    ¡Bienvenido, ${nombre}!
                  </td>
                </tr>

                <!-- TEXTO PRINCIPAL -->
                <tr>
                  <td style="font-size:15px; color:#555; line-height:1.6; text-align:center; padding:20px 0;">
                    Tu cuenta ha sido activada correctamente.<br>
                    Ya puedes iniciar sesión y comenzar a gestionar tus finanzas con claridad, seguridad y control total.
                  </td>
                </tr>

                <!-- BOTÓN -->
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <a href="http://localhost:4200/login"
                      style="background:#4a6cf7; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-size:16px; display:inline-block;">
                      Iniciar sesión
                    </a>
                  </td>
                </tr>

                <!-- SEPARADOR -->
                <tr>
                  <td style="border-top:1px solid #e5e5e5; padding-top:25px;"></td>
                </tr>

                <!-- TÉRMINOS Y CONDICIONES -->
                <tr>
                  <td style="font-size:14px; font-weight:bold; color:#333; padding-bottom:8px;">
                    Términos y Condiciones
                  </td>
                </tr>

                <tr>
                  <td style="font-size:13px; color:#666; line-height:1.6; padding-bottom:20px;">
                    Al utilizar Economic Balance aceptas que los datos que introduces (ingresos, gastos, categorías y presupuestos)
                    serán utilizados exclusivamente para el funcionamiento de la plataforma y la generación de estadísticas financieras.
                    No accedemos a cuentas bancarias ni compartimos información con terceros.
                  </td>
                </tr>

                <!-- POLÍTICA DE PRIVACIDAD -->
                <tr>
                  <td style="font-size:14px; font-weight:bold; color:#333; padding-bottom:8px;">
                    Política de Privacidad
                  </td>
                </tr>

                <tr>
                  <td style="font-size:13px; color:#666; line-height:1.6; padding-bottom:20px;">
                    Tus datos se almacenan de forma segura y se utilizan únicamente para mejorar tu experiencia dentro de la plataforma.
                    Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento contactando con nuestro equipo de soporte.
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="padding-top:25px; font-size:12px; color:#aaa; text-align:center;">
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



