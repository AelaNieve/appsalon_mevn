import { createTransport } from "../config/nodemailer.js";
import colors from "colors";
import { validateMailtrapConfig } from "../helpers/errorHandeling.js";

export async function sendEmailVerification({ name, email, token }) {
  let mailtrapConfig;
  try {
    mailtrapConfig = validateMailtrapConfig();
  } catch (error) {
    throw new Error("Mailtrap configuration missing for verification email.");
  }

  const transporter = createTransport(
    mailtrapConfig.mailtrapHost,
    mailtrapConfig.mailtrapPort,
    mailtrapConfig.mailtrapUser,
    mailtrapConfig.mailtrapPass
  );

  const verificationLink = `${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}`;

  const emailOptions = {
    from: '"AppSalon Co." <no-reply@appsalon.com>',
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
        <p style="font-size: 0.9em; color: #777;">Atentamente,<br>El Equipo de AppSalon<br><em style="color: #FFC300;">"Donde la belleza y el código se encuentran"</em></p>
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
    throw error;
  }
}

export async function sendDeletionConfirmationEmail({ name, email, token }) {
  let mailtrapConfig;
  try {
    mailtrapConfig = validateMailtrapConfig();
  } catch (error) {
    throw new Error("Mailtrap configuration missing for deletion email.");
  }

  const transporter = createTransport(
    mailtrapConfig.mailtrapHost,
    mailtrapConfig.mailtrapPort,
    mailtrapConfig.mailtrapUser,
    mailtrapConfig.mailtrapPass
  );

  const deletionLink = `${process.env.FRONTEND_URL}/auth/delete-account/${token}`;

  const emailOptions = {
    from: '"AppSalon Co." <no-reply@appsalon.com>',
    to: email,
    subject: "🔒 Solicitud de Eliminación de Cuenta en AppSalon 🔒",
    text: `¡Hola ${name}!\n\nHemos recibido una solicitud para eliminar tu cuenta en AppSalon.\n\nPara confirmar la eliminación de tu cuenta, por favor haz clic en el siguiente enlace o cópialo en tu navegador:\n\n${deletionLink}\n\nEste enlace es válido por 1 hora. Si no solicitaste eliminar tu cuenta, puedes ignorar este mensaje de forma segura.\n\nSaludos,\nEl equipo de AppSalon`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #C70039;">Confirmación para Eliminar tu Cuenta, ${name}</h2>
        <p>Hemos recibido una solicitud para eliminar tu cuenta asociada con el correo electrónico (${email}) en AppSalon.</p>
        <p>Si tú iniciaste esta solicitud y deseas proceder con la eliminación permanente de tu cuenta, por favor haz clic en el botón de abajo. <strong>Esta acción es irreversible y eliminará todos tus datos asociados con AppSalon.</strong></p>
        <p style="text-align: center;">
          <a href="${deletionLink}" style="background-color: #D9534F; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmar Eliminación de Cuenta</a>
        </p>
        <p>Este enlace de confirmación es válido por 1 hora.</p>
        <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <p><a href="${deletionLink}">${deletionLink}</a></p>
        <p><strong>Si tú NO solicitaste eliminar tu cuenta, por favor ignora este correo.</strong> No se tomará ninguna acción y tu cuenta permanecerá segura.</p>
        <hr>
        <p style="font-size: 0.9em; color: #777;">Atentamente,<br>El Equipo de AppSalon<br><em style="color: #FFC300;">"Donde la belleza y el código se encuentran"</em></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(emailOptions);
    console.log(
      colors.cyan.italic(
        `📬 Mensaje de confirmación de eliminación enviado a ${email}: ${info.messageId}.`
      )
    );
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️  Error al enviar email de confirmación de eliminación a ${email}: ${error.message}`
      )
    );
    throw error;
  }
}
