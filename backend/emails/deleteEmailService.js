// backend\emails\deleteEmailService.js
import User from "../models/user.js"; // Assuming this is the correct path to your User model
import { sendDeletionConfirmationEmail } from "./authEmailService.js"; // We will add this function to authEmailService.js
import crypto from "crypto";
import colors from "colors"; // Optional: for console logging consistency

// Helper function to generate a token (similar to how you might generate verification tokens)
function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

export const requestAccountDeletion = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return {
        error: true,
        status: 404,
        message: "El email no se encuentra en la base de datos.",
      };
    }

    if (!user.verified) {
      // User found but not verified, delete immediately
      await User.deleteOne({ email: user.email });
      console.log(
        colors.yellow(
          `Cuenta sin verificación ${email} fue borrada al instante.`
        )
      );
      return {
        success: true,
        status: 200,
        message: "Cuenta sin verificación fue borrada al instante.",
      };
    }

    // User is verified, proceed to send a deletion confirmation email
    const deletionToken = generateToken();
    user.deleteToken = deletionToken; // You'll need to add 'deleteToken' and 'deleteTokenExpires' to your User schema
    user.deleteTokenExpires = Date.now() + 3600000; // Token valid for 1 hour (3600000 ms)

    await user.save();

    try {
      // Send the deletion confirmation email
      await sendDeletionConfirmationEmail({
        name: user.name,
        email: user.email,
        token: deletionToken,
      });
      return {
        success: true,
        status: 200,
        message:
          "Confirmación para borrar cuenta enviada, por favor mira tu inbox.",
      };
    } catch (emailError) {
      // If email sending fails, revert the token changes to avoid an orphaned token
      user.deleteToken = undefined;
      user.deleteTokenExpires = undefined;
      await user.save();
      console.error(
        colors.red.bold(
          `Fallo de enviar confirmación de borrar cuenta a: ${email}: ${emailError.message}`
        )
      );
      return {
        error: true,
        status: 500,
        message:
          "No se pudo enviar confirmación de borrar cuenta. Porfavor intentar despues.",
      };
    }
  } catch (error) {
    console.error(
      colors.red.bold(`☠️ Fallo en requestAccountDeletion: ${error.message}`)
    );
    return {
      error: true,
      status: 500,
      message:
        "El servidor fallo mientras intento enviar la confirmación para borrar cuenta.",
    };
  }
};
