import { createTransport } from "../config/nodemailer.js";
import colors from "colors";

export async function sendEmailVerification({ name, email, token }) {
  const mailtrapHost = process.env.MAILTRAP_HOST;
  const mailtrapPort = parseInt(process.env.MAILTRAP_PORT, 10); // Asegúrate que sea número
  const mailtrapUser = process.env.MAILTRAP_USER;
  const mailtrapPass = process.env.MAILTRAP_PASS;

  // Verificamos que todas las variables de entorno para Mailtrap estén definidas
  if (!mailtrapHost || !mailtrapPort || !mailtrapUser || !mailtrapPass) {
    console.error(
      colors.red.bold(
        "☠️  Error: Faltan variables de entorno para la configuración de Mailtrap. El correo no se enviará."
      )
    );
    return; // No continuar si falta configuración
  }

  const transporter = createTransport(
    mailtrapHost,
    mailtrapPort,
    mailtrapUser,
    mailtrapPass
  );

  const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

  const emailOptions = {
    from: '"AppSalon Co." <no-reply@appsalon.com>', // Un remitente más formal
    to: email,
    subject: "🎉 Confirma tu cuenta en AppSalon 🎉",
    text: `¡Hola ${name}!\n\nGracias por registrarte en AppSalon. Por favor, confirma tu cuenta haciendo clic en el siguiente enlace o copiándolo en tu navegador:\n\n${verificationLink}\n\nSi no creaste esta cuenta, puedes ignorar este mensaje tranquilamente.\n\nSaludos,\nEl equipo de AppSalon`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #C70039;">¡Bienvenido/a a AppSalon, ${name}!</h2>
        <p>Estamos súper emocionados de tenerte a bordo. Solo un pasito más para activar tu cuenta.</p>
        <p>Por favor, confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>
        <p style="text-align: center;">
          <a href="${verificationLink}" style="background-color: #FF5733; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmar mi Cuenta</a>
        </p>
        <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>Si tú no te registraste en AppSalon, no te preocupes, puedes ignorar este mensaje y nada pasará. Tu secreto está a salvo con nosotros (porque no tenemos ninguno 😉).</p>
        <hr>
        <p style="font-size: 0.9em; color: #777;">Atentamente,<br>El Equipo de AppSalon<br><em_style="color: #FFC300;">"Donde la belleza y el código se encuentran"</em></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(emailOptions);
    console.log(
      colors.cyan.italic(
        `📬 Mensaje enviado a ${email}: ${info.messageId}. ¡Que lo revise pronto!`
      )
    );
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️  Error al enviar email de verificación a ${email}: ${error.message}`
      )
    );
    // Es importante relanzar el error o manejarlo para que el llamador sepa que falló.
    throw error;
  }
}
