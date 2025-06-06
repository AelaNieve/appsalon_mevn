import User from "../models/user.js";
import { uniqueId } from "../helpers/errorHandling.js";
import bcrypt from "bcryptjs";
import colors from "colors";
import { createHash } from "node:crypto";
import {
  sendEmailVerification,
  sendDeletionConfirmationEmail,
  sendPasswordRecoveryEmail,
  sendAccountBlockedEmail,
} from "../emails/authEmailService.js";

// --- Para prevenir attaquens de spam de creación y eliminación de cuentas ---
const registrationAttempts = new Map(); // Stores IP addresses and their request timestamps
const MAX_REGISTRATION_ATTEMPTS = 5; // Max attempts per IP
const REGISTRATION_TIME_WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Valida una contraseña según los criterios definidos.
 * @param {string} password - La contraseña a validar.
 * @returns {Promise<{isValid: boolean, message: string|null}>} - Objeto con estado de validez y mensaje de error si no es válida.
 */
const validatePassword = async (password) => {
  // Chequea por patrones comunes dentro de las contraseñas, información en el .env
  const commonPatternsString = process.env.COMMON_PASSWORD_PATTERNS || "";
  const commonPatterns = commonPatternsString
    .split(",")
    .map((pattern) => pattern.trim())
    .filter((pattern) => pattern.length > 0);

  // Constantes para validación de contraseña
  const MIN_PASSWORD_LENGTH = 16;
  const HAS_UPPERCASE_REGEX = /[A-Z]/;
  const HAS_LOWERCASE_REGEX = /[a-z]/;
  const HAS_NUMBER_REGEX = /[0-9]/;
  const HAS_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
  const REPEATING_CHARS_REGEX = /(.)\1{3,}/; // regex que chekea si hay más de 3 caracteres repetidos
  const SIMPLE_NUMBER_SEQUENCES_REGEX =
    /123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321/; // regex que chekea si hay 3 numeros secuenciales
  const SIMPLE_ALPHABET_SEQUENCES_REGEX =
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i; // regex que chekea si hay 3 letras secuenciales

  // Función para identificar contrasseñas comunes a nivel de variables de entorno
  const isCommonPattern = (pwd) => {
    const lowerPassword = pwd.toLowerCase();
    for (const pattern of commonPatterns) {
      if (lowerPassword.includes(pattern)) {
        return true;
      }
    }
    // Uses regex constants from validatePassword's scope
    if (REPEATING_CHARS_REGEX.test(pwd)) return true;
    if (SIMPLE_NUMBER_SEQUENCES_REGEX.test(pwd)) return true;
    if (SIMPLE_ALPHABET_SEQUENCES_REGEX.test(lowerPassword)) return true;
    return false;
  };

  // Función para calcular el hash SHA-1 (Toma la información de la base de datos de contraseñas publicas)
  const sha1 = async (message) => {
    const hash = createHash("sha1");
    hash.update(message);
    return hash.digest("hex");
  };

  // Función para checar si la contraseña está en una base de datos pública
  const isPwnedPassword = async (pwdToCheck) => {
    try {
      const digest = await sha1(pwdToCheck);
      const prefix = digest.substring(0, 5);
      const suffix = digest.substring(5).toUpperCase();

      const response = await fetch(
        // Base de datos de contraseñas filtradas
        `https://api.pwnedpasswords.com/range/${prefix}`
      );
      if (!response.ok) {
        console.error(
          colors.yellow(
            `⚠️ Falló la revisión de contraseñas pwned (API): ${response.status} ${response.statusText}. Se permite la contraseña por precaución.`
          )
        );
        return false; // Es más seguro permitirla si la API falla
      }

      const text = await response.text();
      const hashes = text.split("\r\n");

      const found = hashes.some((line) => {
        const [hashSuffix] = line.split(":");
        return hashSuffix.toUpperCase() === suffix;
      });

      return found;
    } catch (error) {
      console.error(
        colors.yellow(
          `⚠️ Error al verificar con PwnedPasswords (excepción): ${error.message}. Se permite la contraseña por precaución.`
        )
      );
      return false;
    }
  };

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    };
  }
  if (!HAS_UPPERCASE_REGEX.test(password)) {
    return {
      isValid: false,
      message: "La contraseña necesita al menos una letra mayúscula.",
    };
  }
  if (!HAS_LOWERCASE_REGEX.test(password)) {
    return {
      isValid: false,
      message: "La contraseña necesita al menos una letra minúscula.",
    };
  }
  if (!HAS_NUMBER_REGEX.test(password)) {
    return {
      isValid: false,
      message: "La contraseña necesita al menos un número.",
    };
  }
  if (!HAS_SPECIAL_CHAR_REGEX.test(password)) {
    return {
      isValid: false,
      message:
        "La contraseña necesita al menos un carácter especial (ej. !@#$%).",
    };
  }

  // verificando si la contraseña no tiene patrones comunes
  if (isCommonPattern(password)) {
    return {
      isValid: false,
      message: "Esa contraseña tiene un patron demasiado comun",
    };
  }

  // Revisión de contraseña "pwned" (asíncrona)
  const pwned = await isPwnedPassword(password);
  if (pwned) {
    return {
      isValid: false,
      message:
        "Esta contraseña ha aparecido en filtraciones de datos y no es segura. Por favor, elige otra.",
    };
  }

  return { isValid: true, message: null };
};

// Controlador para el registro de usuarios
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validación básica de campos obligatorios
  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    return res
      .status(400)
      .json({ msg: "Todos los campos son obligatorios, ¡no seas tímido!" });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    //console.log(.yellow("Esa mamada de email que es?: ", email));
    return res.status(400).json({ msg: "El email no es valido." });
  }
  // Validar que la contraseña sea segura
  const passwordValidationResult = await validatePassword(password);
  if (!passwordValidationResult.isValid) {
    return res.status(400).json({ msg: passwordValidationResult.message });
  }

  // --- Logica para limitar el ip para evitar spam ---
  const clientIp = req.ip; // Ensure your Express app is configured to correctly get req.ip
  const now = Date.now();
  const attempts = registrationAttempts.get(clientIp) || [];

  // filtrando intentos
  const recentAttempts = attempts.filter(
    (timestamp) => now - timestamp < REGISTRATION_TIME_WINDOW_MS
  );

  if (recentAttempts.length >= MAX_REGISTRATION_ATTEMPTS) {
    console.warn(
      colors.yellow(
        `⚠️ Rate limit exceeded for IP: ${clientIp}. Registration attempts: ${recentAttempts.length}`
      )
    );
    return res.status(429).json({
      msg: "Demasiadas solicitudes de registro desde esta IP. Por favor, inténtalo más tarde.",
    });
  }

  try {
    // Actuarlizar el intento antes de continuar con la registración

    const commonResponse =
      "¡Registro exitoso! Revisa tu correo para verificar tu cuenta. ¡Ya casi estás dentro!";

    registrationAttempts.set(clientIp, [...recentAttempts, now]);

    //  Verificar si el usuario ya existe.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      //console.log(colors.yellow(`☠️  El email ya fue encontrado en la base de datos ${email}`));
      return res.status(200).json({ msg: commonResponse });
    }

    // Hashear la contraseña antes de guardarla.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creando nuevo schema de usuario
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    // Enviar email de verificación.
    try {
      await sendEmailVerification({
        name: user.name,
        email: user.email,
        token: user.token,
      });
    } catch (emailError) {
      console.error(
        colors.red.bold(
          `☠️  Falló la función sendEmailVerification de: ${user.email}, error ${emailError.message}`
        )
      );
      // si no se puede enviar el correo el usuario es borrado
      await User.deleteOne({ _id: user._id });
      return res.status(400).json({
        msg: `Falló el envío del email de verificación: ${emailError.message}. se cancelo la creación de usuario`,
      });
    }
    // console.log(`Registro de nuevo usuario exitoso ${user}.`);
    return res.status(200).json({ msg: commonResponse });
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️  Error en la funcion register durante el registro: ${error.message}`
      )
    );
    return res.status(500).json({
      msg: "Error interno del servidor. Inténtalo más tarde",
    });
  }
};

// Controlador para verificar la cuenta
const verifyAccount = async (req, res) => {
  const { token } = req.params;
  try {
    const commonError =
      "Fallo la verficación quizas el token ya no existe (Borra tu cuenta) o la cuenta ya fue verificada.";
    const user = await User.findOne({ token });
    if (!user) {
      //console.error(colors.red.bold(`☠️ No se encontro el token: ${token}`));
      return res.status(401).json({ msg: commonError });
    }

    user.verified = true;
    user.token = "";
    await user.save();
    //console.error(colors.green.bold(`Exito en la creación de: ${user.name}`));
    return res.status(200).json({
      msg: "¡Cuenta confirmada con éxito! Ahora sí, ¡a disfrutar!",
    });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error en verifyAccount: ${error.message}`)
    );
    res
      .status(500)
      .json({ msg: "Error interno al confirmar la cuenta. ¡Qué mala pata!" });
  }
};

// Controlador para el login de usuarios
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "De verdad acabas de enviar un espacio vacio?" });
  }

  try {
    const user = await User.findOne({ email });
    const commonError =
      "La contraseña es incorrecta tienes un numero limitado de intentos o el email no es valido o la cuenta no ha sido verificada o ha sido bloqueada revisa tu correo";

    if (!user || !user.verified) {
      return res.status(401).json({ msg: commonError });
    }

    // 1. Primero, comprueba si la cuenta ya está bloqueada
    if (user.passwordAttempts && user.passwordAttempts >= 6) {
      return res.status(401).json({ msg: commonError });
    }

    // 2. Compara la contraseña
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // 3. Si la contraseña es CORRECTA
    if (isPasswordCorrect) {
      // Restablece los intentos a 0 y guarda
      user.passwordAttempts = 0;
      await user.save();

      //console.log(colors.green.bold(`Sesión Iniciada ${user.name}`));
      return res.status(200).json({
        msg: "¡Inicio de sesión exitoso! Qué alegría verte de nuevo por AppSalon.",
      });
    }

    // 4. Si la contraseña es INCORRECTA
    // Inicializa el contador si no existe y luego lo incrementa
    user.passwordAttempts = (user.passwordAttempts || 0) + 1;

    // Comprueba si este intento bloquea la cuenta
    if (user.passwordAttempts === 6) {
      try {
        sendAccountBlockedEmail({
          name: user.name,
          email: user.email,
        });
        //console.log(colors.blue.bold(`Email de cuenta bloqueada enviado: ${user.name}`));
      } catch (error) {
        //console.error(colors.red.bold(`Error de sendAccountBlockedEmail: ${error.message}`));
      }
    }

    // Guarda el nuevo número de intentos fallidos
    await user.save();

    return res.status(401).json({ msg: commonError });
  } catch (error) {
    //console.error(colors.red.bold(`☠️  Error en el servidor durante el login: ${error.message}`));
    return res.status(500).json({
      msg: "Error interno del servidor. Algo se rompió, auch",
    });
  }
};

// Controlador para solicitar eliminación de cuenta
const requestAccountDeletion = async (req, res) => {
  const { email } = req.body;

  // testeo rapido del email
  if (!email || email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) {
    //console.log(.yellow("Esa mamada de email que es?: ", email));
    return res.status(401).json({ msg: "El email no es valido." });
  }
  try {
    const user = await User.findOne({ email });
    const commonError =
      "Si la cuenta existe y está verificada, se enviará un enlace para borrar la cuenta.";

    if (!user) {
      //console.log(colors.blue.bold("Solicitud de eliminación para email no registrado:", email));
      return res.status(200).json({ msg: commonError });
    }
    // Se elimina directamente la cuenta si no estaba verificada
    if (!user.verified) {
      await User.deleteOne({ _id: user._id });
      //console.log(colors.green(`Cuenta no verificada (${email}) eliminada directamente.`));
      return res
        .status(200)
        .json({ msg: "La cuenta no estaba verificada y ha sido eliminada." });
    }
    // Verificación que previene spam de la función
    if (
      user.deleteToken &&
      user.deleteTokenExpires &&
      user.deleteTokenExpires > Date.now()
    ) {
      //console.log(colors.yellow(`Ya existe una solicitud activa de eliminación para ${email}.`));
      return res.status(200).json({ msg: commonError });
    }
    // Creamos un token y lo subimos al schema
    const tempToken = uniqueId();
    user.deleteToken = tempToken;
    // Tiempo de vida del token 1 hora
    user.deleteTokenExpires = Date.now() + 3600000;
    await user.save();
    // Creamos un objeto y enviamos el email
    await sendDeletionConfirmationEmail({
      name: user.name,
      email: user.email,
      token: user.deleteToken,
    });
    console.log(
      colors.blue.bold(
        `Enlace de confirmación para eliminar cuenta enviado a ${email}.`
      )
    );
    return res.status(200).json({ msg: commonError });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error en requestAccountDeletion: ${error.message}`)
    );
    return res.status(500).json({
      msg: "Error interno del servidor. No se pudo procesar tu solicitud.",
    });
  }
};

// Controlador para confirmar la eliminación de cuenta
const confirmAccountDeletion = async (req, res) => {
  const { deleteToken } = req.params;

  try {
    const commonError =
      "Si la cuenta existe y está verificada, se enviará un enlace para borrar la cuenta.";
    const deletionUser = await User.findOne({ deleteToken });

    if (!deletionUser) {
      //console.log(colors.yellow(`No se encontro usuario con: ${deleteToken}.`));
      return res.status(200).json({ msg: commonError });
    }
    const expiredUser = deletionUser.deleteTokenExpires;
    if (expiredUser < Date.now()) {
      deletionUser.deleteToken = "";
      deletionUser.deleteTokenExpires = "";
      await deletionUser.save();
      //console.log(colors.yellow(`Token de eliminación expirado para ${deleteToken}.`));
      return res.status(200).json({ msg: commonError });
    }
    await User.deleteOne({ _id: deletionUser._id });
    //console.log(colors.green(`Cuenta eliminada con éxito: ${deletionUser.email}`));
    return res.status(200).json({ msg: "Cuenta eliminada con éxito." });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error en confirmAccountDeletion: ${error.message}`)
    );
    return res.status(500).json({
      msg: "Error interno del servidor. Falló la eliminación de la cuenta.",
    });
  }
};

// Controlador para solicitar reseteo de contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  //console.log(email);
  if (!email || email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) {
    //console.log(colors.yellow("Esa mamada de email que es?: ", email));
    return res.status(200).json({ msg: "El email no es valido." });
  }

  try {
    const user = await User.findOne({ email });
    const commonError =
      "Si una cuenta con ese email existe y está verificada, se enviará un enlace de recuperación, revise su bandeja de entrada y spam. El enlace es válido por 1 hora.";

    if (!user) {
      //console.log(colors.blue(`Solicitud de olvido de contraseña para email no registrado: ${email}`));
      return res.status(200).json({ msg: commonError });
    }

    if (!user.verified) {
      //console.log(colors.yellow(`Cuenta no verificada (${email}) encontrada en forgotPassword. Eliminando.`));
      await User.deleteOne({ _id: user._id });
      return res
        .status(200)
        .json({ msg: "La cuenta no estaba verificada y ha sido eliminada." });
    }

    // checkeo para evitar stamp de la funcion
    if (
      user.passwordResetToken &&
      user.passwordResetTokenExpires &&
      user.passwordResetTokenExpires > Date.now()
    ) {
      //console.log(colors.blue(`Ya existe un token de recuperación activo para: ${email}.`));
      return res.status(200).json({ msg: commonError });
    }

    const resetToken = uniqueId();
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = Date.now() + 3600000; // Token válido por 1 hora

    await user.save();

    await sendPasswordRecoveryEmail({
      name: user.name,
      email: user.email,
      token: resetToken,
    });
    console.log(
      colors.blue.bold(
        `Email de recuperación de contraseña enviado a ${email}.`
      )
    );
    return res.status(200).json({ msg: commonError });
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️  Error en forgotPassword controller: ${error.message}`
      )
    );
    return res.status(500).json({
      msg: "Error interno del servidor. No se pudo procesar tu solicitud.",
    });
  }
};

// Controlador para verificar el token y cambiar la contraseña
const resetPassword = async (req, res) => {
  const { password, passwordResetToken } = req.body;
  //console.log("contraseña ", password, "token ", passwordResetToken);

  if (!password || password.trim() === "") {
    return res.status(400).json({ msg: "La nueva contraseña es obligatoria." });
  }

  try {
    const userResetPassword = await User.findOne({ passwordResetToken });
    const commonError =
      "El enlace para restablecer la contraseña no es válido o ha expirado. Por favor, solicite uno nuevo.";
    if (!userResetPassword) {
      //console.log(colors.yellow(`No se encontro usuario con: ${passwordResetToken}, ${userResetPassword}.`));
      return res.status(200).json({ msg: commonError });
    }
    // Consiguiendo la fecha y hora de creación de la petición de resetear contraseña
    const expiredUser = userResetPassword.passwordResetTokenExpires;
    // Si la hora para verificar ya paso se resetea la variable
    if (expiredUser < Date.now()) {
      userResetPassword.passwordResetToken = "";
      userResetPassword.passwordResetTokenExpires = "";
      await userResetPassword.save();
      //console.log(colors.yellow(`EL link para cambiar contraseña expirado para ${user.name}.`));
      return res.status(200).json({ msg: commonError });
    }

    //verificando si la nueva contraseña es segura
    const passwordValidationResult = await validatePassword(password);
    if (!passwordValidationResult.isValid) {
      return res.status(400).json({ msg: passwordValidationResult.message });
    }
    // Haseado la contraseña
    const salt = await bcrypt.genSalt(10);
    userResetPassword.password = await bcrypt.hash(password, salt);
    // Reseteando los tokens para la validación para cambiar la contraseña
    userResetPassword.passwordResetToken = "";
    userResetPassword.passwordResetTokenExpires = "";
    // Esta linea se encarga de resetar la seguridad del brute foce
    userResetPassword.passwordAttempts = 0;

    await userResetPassword.save();
    // console.log(colors.green(`Contraseña actualizada con éxito para ${userResetPassword.email}.`));
    return res.status(200).json({
      msg: "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
    });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error en resetPassword controller: ${error.message}`)
    );
    return res.status(500).json({
      msg: "Error interno del servidor al intentar cambiar la contraseña.",
    });
  }
};

export {
  register,
  verifyAccount,
  login,
  requestAccountDeletion,
  confirmAccountDeletion,
  forgotPassword,
  resetPassword,
};
