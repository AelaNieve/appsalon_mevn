import User from "../models/user.js";
import { uniqueId } from "../helpers/errorHandeling.js";
import bcrypt from "bcryptjs";
import colors from "colors";
import {
  sendEmailVerification,
  sendDeletionConfirmationEmail,
} from "../emails/authEmailService.js"; // Import the new email service function
import { createHash } from "node:crypto";

const commonPatternsString = process.env.COMMON_PASSWORD_PATTERNS || "";
const commonPatterns = commonPatternsString
  .split(",")
  .map((pattern) => pattern.trim())
  .filter((pattern) => pattern.length > 0);

// Constantes para validación de contraseña, apuesto que los usuarios las van a olvidar antes de que sean hackeadas
const MIN_PASSWORD_LENGTH = 16;
const HAS_UPPERCASE_REGEX = /[A-Z]/;
const HAS_LOWERCASE_REGEX = /[a-z]/;
const HAS_NUMBER_REGEX = /[0-9]/;
const HAS_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
const REPEATING_CHARS_REGEX = /(.)\1{3,}/; // 4 o más caracteres repetidos
const SIMPLE_NUMBER_SEQUENCES_REGEX =
  /123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321/;
const SIMPLE_ALPHABET_SEQUENCES_REGEX =
  /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i; // 'i' para ignorar mayúsculas/minúsculas

// Función para verificar contra patrones comunes de contraseñas, ¡que no te jalen las patas con "Contraseña123456!"
const isCommonPattern = (password) => {
  const lowerPassword = password.toLowerCase();
  for (const pattern of commonPatterns) {
    if (lowerPassword.includes(pattern)) {
      return true;
    }
  }

  // Verificar secuencias simples o caracteres repetidos.
  if (REPEATING_CHARS_REGEX.test(password)) return true;
  if (SIMPLE_NUMBER_SEQUENCES_REGEX.test(password)) return true;
  if (SIMPLE_ALPHABET_SEQUENCES_REGEX.test(lowerPassword)) return true;

  return false;
};

// Función para calcular el hash SHA-1 (usando el módulo crypto de Node.js)
// Necesario para la API de HaveIBeenPwned, a ver si tu contraseña es publica
const sha1 = async (message) => {
  const hash = createHash("sha1");
  hash.update(message);
  return hash.digest("hex");
};

// Función para checar si la contraseña está en una base de datos pública (usando la API de HaveIBeenPwned)
// Ojo: Si la API falla, mejor tener un usuario con contraseña insegura que no tener usuario
const isPwnedPassword = async (password) => {
  try {
    const digest = await sha1(password);
    const prefix = digest.substring(0, 5);
    const suffix = digest.substring(5).toUpperCase();

    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`
    );
    if (!response.ok) {
      console.error(
        `Falló la revisión de contraseñas pwned (API): ${response.status} ${response.statusText}. Se permite la contraseña por precaución.`
      );
      return false; // Es más seguro permitirla si la API falla
    }

    const text = await response.text();
    const hashes = text.split("\r\n");

    // Buscamos si nuestro sufijo de hash está en la lista de la API
    const found = hashes.some((line) => {
      const [hashSuffix] = line.split(":");
      return hashSuffix.toUpperCase() === suffix;
    });

    return found;
  } catch (error) {
    console.error(
      "Error al verificar con PwnedPasswords (excepción):",
      error.message,
      "Se permite la contraseña por precaución."
    );
    // En caso de error (ej. de red), tratamos como no "pwned" para no bloquear usuarios innecesariamente.
    return false;
  }
};

// Controlador para el registro de usuarios
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validación básica antes de los calculos más "pesados"
  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    // Checa undefined, null, o string vacío
    const error = new Error(
      "Todos los campos son obligatorios, ¡no seas tímido!"
    );
    return res.status(400).json({ msg: error.message });
  }

  // 2. Aquí nos ponemos serios
  const passwordValidationChecks = [
    {
      check: password.length < MIN_PASSWORD_LENGTH,
      message: `La tienes demasiado corta... la contraseña... el minimo es ${MIN_PASSWORD_LENGTH} caracteres.`,
    },
    {
      check: !HAS_UPPERCASE_REGEX.test(password),
      message:
        "La contraseña necesita al menos una letra mayúscula o sino ta muy infantil",
    },
    {
      check: !HAS_LOWERCASE_REGEX.test(password),
      message: "Incluye alguna minúscula o tara muy caza tumbas",
    },
    {
      check: !HAS_NUMBER_REGEX.test(password),
      message: "Mmmm no se que comentario poner, añade un numero",
    },
    {
      check: !HAS_SPECIAL_CHAR_REGEX.test(password),
      message:
        "Un carácter especial (ej. !@#$%) para despistar a los malos, ¡como un ninja!",
    },
    {
      check: isCommonPattern(password),
      message:
        "Esa contraseña es más común que el pan. Prueba algo más original",
    },
  ];

  for (const validation of passwordValidationChecks) {
    if (validation.check) {
      return res.status(400).json({ msg: validation.message });
    }
  }

  // 3. Revisión de contraseña "pwned". sirve para no poner contraseñas de uso publico
  try {
    const pwned = await isPwnedPassword(password);
    if (pwned) {
      const error = new Error(
        "¡Houston, tenemos un problema! Esta contraseña es de uso publico."
      );
      return res.status(400).json({ msg: error.message });
    }
  } catch (apiError) {
    // No es necesario hacer nada más aquí, la función devuelve false en caso de error.
  }

  try {
    // 4. Verificar si el usuario ya existe. ¿Eres tú de nuevo?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error(
        "¡Registro exitoso! Revisa tu correo para verificar tu cuenta. ¡Ya casi estás dentro!"
      );
      console.log(
        "Este correo ya está registrado. ¿Se te olvidó que ya tenías cuenta?"
      );
      return res.status(409).json({ msg: error.message }); // 409 Conflict
    }

    // 5. Hashear la contraseña antes de guardarla. Ni los admins sabran la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword, // Guardar la contraseña hasheada
    });
    // El token se genera automáticamente por el modelo gracias al default.

    await user.save();

    // 6. Enviar email de verificación. ¡Confirma que eres tú y no un impostor!
    try {
      await sendEmailVerification({
        name: user.name,
        email: user.email,
        token: user.token,
      });
    } catch (emailError) {
      console.error(
        colors.red.bold(
          `☠️   Falló el envío de email de verificación para ${user.email}: ${emailError.message}`
        )
      );
      // Podemos querer notificar al usuario que tiene un problema el email para recibir correos
    }

    return res.status(201).json({
      msg: "¡Registro exitoso! Revisa tu correo para verificar tu cuenta. ¡Ya casi estás dentro!",
    });
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️   Error en el servidor durante el registro: ${error.message}`
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

  // Buscamos al usuario por el token.
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error(
      "Token no válido o ya expiró. Parece que este conjuro ya no funciona."
    );
    return res.status(401).json({ msg: error.message });
  }

  try {
    user.verified = true;
    user.token = ""; // si no se limpian los tockens alguien podria registrar cuentas sin validación
    await user.save();
    res.json({ msg: "¡Cuenta confirmada con éxito! Ahora sí, ¡a disfrutar!" });
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️   Error al guardar usuario verificado: ${error.message}`
      )
    );
    res
      .status(500)
      .json({ msg: "Error interno al confirmar la cuenta. ¡Qué mala pata!" });
  }
};

// Controlador para el login de usuarios
const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validar que email y password no estén vacíos
  if (!email || !password) {
    const error = new Error("De verdad acabas de enviar un espacio vacio?");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // 2. Checar si el usuario existe.
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error(
        "Usuario no encontrado. ¿Seguro que te registraste con este correo?"
      );
      return res.status(401).json({ msg: error.message });
    }

    // 3. Checar si la cuenta está verificada.
    if (!user.verified) {
      const error = new Error(
        "Tu cuenta aún no ha sido verificada. ¡Revisa tu email y confirma tu identidad, mier..!"
      );
      return res.status(401).json({ msg: error.message });
    }

    // 4. Verificar la contraseña.
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error(
        "Contraseña incorrecta. ¿Seguro que es la tuya o estás intentando hackear a la abuela?"
      );
      return res.status(401).json({ msg: error.message });
    }

    // Si todo está bien, ¡bienvenido de vuelta!

    return res.status(200).json({
      msg: "¡Inicio de sesión exitoso! Qué alegría verte de nuevo por AppSalon.",
    });
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️   Error en el servidor durante el login: ${error.message}`
      )
    );
    return res.status(500).json({
      msg: "Error interno del servidor. Algo se rompió, auch",
    });
  }
};

const confirmAccountDeletion = async (req, res) => {
  const { deleteToken } = req.params; // Token from URL path

  try {
    const user = await User.findOne({ deleteToken });

    if (!user) {
      return res.status(404).json({ msg: "Token no válido o no encontrado." });
    }

    if (!user.deleteTokenExpires || user.deleteTokenExpires < Date.now()) {
      // Clear the expired token
      user.deleteToken = null;
      user.deleteTokenExpires = null;
      await user.save();
      return res.status(401).json({
        msg: "El enlace para borrar la cuenta ha expirado. Por favor, solicite uno nuevo.",
      });
    }

    // Token is valid and not expired, proceed with deletion
    await User.deleteOne({ _id: user._id });
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

// Renamed from verifyDelete
const requestAccountDeletion = async (req, res) => {
  const { email } = req.body;
  if (!email || email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ msg: "El email no es valido." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuario no existe");
      return res.status(200).json({
        msg: "Si la cuenta existe, el link para borar cuenta y fue enviado.",
      });
    }

    // In requestAccountDeletion (formerly verifyDelete), after finding the user:
    if (!user.verified) {
      await User.deleteOne({ _id: user._id });
      return res
        .status(200)
        .json({ msg: "La cuenta no estaba verificada y ha sido eliminada." });
    }
    // ... then proceed with token generation and email for verified users

    // Check if a valid token already exists (as implemented in point 1)
    if (
      user.deleteToken &&
      user.deleteTokenExpires &&
      user.deleteTokenExpires > Date.now()
    ) {
      console.log("Ya existe una solicitud activa. Revise su correo.");
      return res.status(400).json({
        msg: "Si la cuenta existe, el link para borar cuenta y fue enviado.",
      });
    }

    // Generate token, set expiry, save user
    const tempToken = uniqueId();
    user.deleteToken = tempToken;
    user.deleteTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send deletion confirmation email
    await sendDeletionConfirmationEmail({
      name: user.name,
      email: user.email,
      token: user.deleteToken, // Use the new token
    });
    console.log("Enlace de confirmación para eliminar cuenta enviado.");
    return res.status(200).json({
      msg: "Si la cuenta existe, el link para borar cuenta y fue enviado.",
    });
  } catch (error) {
    console.error(
      colors.red.bold(
        // Consider a more specific name if you rename the function later
        `☠️  Error in requestAccountDeletion (requesting deletion) controller: ${error.message}`
      )
    );
    return res.status(500).json({
      msg: "Error interno del servidor. No se pudo procesar tu solicitud en este momento.",
    });
  }
};

// New controller function to confirm and execute account deletion

export {
  register,
  verifyAccount,
  login,
  requestAccountDeletion,
  confirmAccountDeletion,
};
