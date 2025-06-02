import mongoose from "mongoose";
import { uniqueId } from "../helpers/errorHandeling.js"; // Assuming this is for token generation

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true, // Still good to trim any accidental whitespace
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  token: {
    type: String,
    default: () => uniqueId(), // Assuming uniqueId is a function that generates a unique ID
  },
  verified: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
