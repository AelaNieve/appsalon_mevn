import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({ name, email, token }) {
  const transporter = createTransport(
    "sandbox.smtp.mailtrap.io",
    2525,
    "54b78be14878b6",
    "472c13aa9ade1a"
  );
  const info = await transporter.sendMail({
    from: "AppSalon",
    to: email,
    subject: "Crear cuenta AppSalon",
    text: "App Salon - Confirma tu cuenta",
    html: ` 
    <p> Hola: ${name}, confirma tu cuenta de Appsalon </p>
    <a href="http://localhost:4000/api/auth/verify/${token}"> Confirmar cuenta </a>
    <p> Si tu no creaste esta cuenta, pueddes ignorar este mensaje </p>
    `,
  });
  console.log("Mensaje enviado: ", info.messageId);
}
