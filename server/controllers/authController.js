import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const otp = generateOTP();
    const user = await User.create({ name, email, password, otp });

    await sendEmail(email, "Verify your account", `Your OTP: ${otp}`);
    res.status(201).json({ message: "User registered, OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  user.isVerified = true;
  user.otp = null;
  await user.save();
  res.json({ token: generateToken(user._id) });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
