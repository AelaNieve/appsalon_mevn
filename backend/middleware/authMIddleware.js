import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  // Check if the AUTH_TOKEN cookie exists
  if (!req.cookies.AUTH_TOKEN) {
    // If the cookie is not present, the user is not authenticated.
    return res.status(401).json({ msg: "Authentication token is missing." });
  }

  try {
    const token = req.cookies.AUTH_TOKEN;

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID from the decoded token payload
    // and exclude sensitive fields from the result.
    const user = await User.findById(decoded.id).select(
      "-password -verified -token -__v -passwordAttempts -deleteToken -deleteTokenExpires -passwordResetToken -passwordResetTokenExpires"
    );

    if (!user) {
      // If no user is found with that ID (e.g., user was deleted), send an error.
      return res.status(401).json({ msg: "Invalid token: User not found." });
    }

    // Attach the user object to the request for use in subsequent routes
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If jwt.verify fails (e.g., token is expired or malformed), send an unauthorized error.
    console.error("Authentication error:", error.message);
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
};

export default authMiddleware;
