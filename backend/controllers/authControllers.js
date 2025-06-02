import User from "../models/user.js";
import bcrypt from "bcryptjs"; // Import bcrypt
import { sendEmailVerification } from "../emails/authEmailService.js";

const commonPatternsString = process.env.COMMON_PASSWORD_PATTERNS || "";
const commonPatterns = commonPatternsString
  .split(",")
  .map((pattern) => pattern.trim())
  .filter((pattern) => pattern.length > 0);
// Function to check against common password patterns
const isCommonPattern = (password) => {
  for (const pattern of commonPatterns) {
    if (password.toLowerCase().includes(pattern)) {
      return true;
    }
  }

  // Check for simple sequential/repeating characters (e.g., "aaaaa", "abcde")
  if (/(.)\1{3,}/.test(password)) return true; // Checks for 4 or more repeating characters
  if (
    /123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321/.test(
      password
    )
  )
    return true; // Simple number sequences
  if (
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(
      password.toLowerCase()
    )
  )
    return true; // Simple alphabet sequences

  for (const pattern of commonPatterns) {
    if (password.toLowerCase().includes(pattern)) {
      return true;
    }
  }
  return false;
};

// Function to check if password exists in a public database (using HaveIBeenPwned API)
const isPwnedPassword = async (password) => {
  try {
    // Have I Been Pwned API uses SHA-1 hash prefix for anonymity
    const sha1Hash = await sha1(password);
    const prefix = sha1Hash.substring(0, 5);
    const suffix = sha1Hash.substring(5);

    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`
    );
    if (!response.ok) {
      // It's safer to allow the password if the API is down or returns an error,
      // rather than blocking legitimate users. Log the error for monitoring.
      console.error(
        `Failed to check pwned passwords: ${response.status} ${response.statusText}`
      );
      return false;
    }

    const text = await response.text();
    const hashes = text.split("\r\n").map((line) => {
      const [hashSuffix, count] = line.split(":");
      return { hashSuffix, count: parseInt(count, 10) };
    });

    const found = hashes.find(
      (h) => h.hashSuffix.toUpperCase() === suffix.toUpperCase()
    );
    return found ? true : false;
  } catch (error) {
    console.error("La contraseña es publica we:", error);
    // In case of an error, treat it as not pwned to avoid false negatives.
    return false;
  }
};

// Helper function to calculate SHA-1 hash (Node.js crypto module)
const sha1 = async (message) => {
  const { createHash } = await import("node:crypto");
  const hash = createHash("sha1");
  hash.update(message);
  return hash.digest("hex");
};

const register = async (req, res) => {
  const { name, email, password } = req.body; // Destructure for easier access

  // 1. Basic empty input validation
  if (!name || !email || !password) {
    const error = new Error("No mames como te vas a dejar un input vacio");
    return res.status(400).json({ msg: error.message });
  }

  // 2. Password validation
  const minLength = 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    const error = new Error(
      `La tienes muy corta... ${minLength} cm de contraseña.`
    );
    return res.status(400).json({ msg: error.message });
  }
  if (!hasUppercase) {
    const error = new Error(
      "Vengo a mamar que la contraseña tiene que tener una mayuscula."
    );
    return res.status(400).json({ msg: error.message });
  }
  if (!hasLowercase) {
    const error = new Error(
      "Vengo a mamar que la contraseña tiene que tener una minuscula."
    );
    return res.status(400).json({ msg: error.message });
  }
  if (!hasNumber) {
    const error = new Error(
      "Vengo a mamar que la contraseña tiene que tener un numero."
    );
    return res.status(400).json({ msg: error.message });
  }
  if (!hasSpecialChar) {
    const error = new Error(
      "La contraseña debe tener un caracter insultante (e.g., !@#$%^&*)."
    );
    return res.status(400).json({ msg: error.message });
  }

  // 3. New: Common pattern check
  if (isCommonPattern(password)) {
    const error = new Error(
      "Tu contraseña es demasiado basica. Por favor, elige una más unique (Hay patrones que son faciles de romper en tu contraseña)."
    );
    return res.status(400).json({ msg: error.message });
  }

  // 4. New: Pwned password check
  const pwned = await isPwnedPassword(password);
  if (pwned) {
    const error = new Error(
      "Esta contraseña es publica we, no sirve como contraseña."
    );
    return res.status(400).json({ msg: error.message });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error(
        "Alguien ya utilizo este email, ¿No olvidaste que ya tenias cuenta?"
      );
      console.log(error);
      console.log(existingUser);
      return res.status(409).json({ msg: error.message }); // 409 Conflict
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const user = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
    });

    await user.save();

    sendEmailVerification({
      name: user.name,
      email: user.email,
      token: user.token,
    });
    return res
      .status(201)
      .json({ msg: "Yayyy lograste registrate!, pero verifica el email" }); // 201 Created
  } catch (error) {
    console.error(error); // Use console.error for errors
    return res.status(500).json({ msg: "F no se pudo registrar." });
  }
};

export { register };
