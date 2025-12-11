import userModel from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

import {generateAccessToken ,generateRefreshToken} from "../utils/token.js"
import { generateEmailToken } from "../utils/emailToken.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { generateResetToken } from "../utils/resetToken.js";

export const Register = async (req, res) => {
  const { email, name, password } = req.body;
  console.log(req.body)

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "User already exists" });
    }

    const user = await userModel.create({ email, name, password, verified: false });

    // Step 1: Generate email token
    const emailToken = generateEmailToken(user._id);
    user.emailToken = emailToken; // optional: store token
    await user.save();

    // Step 2: Send verification email
    await sendVerificationEmail(user.email, emailToken);

    res.status(201).json({
      message: "User registered. Please verify your email before logging in!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("The user was not created");
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Step 1: Check if verified
    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password was not match" });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await userModel.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null }
    );
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const GetMe = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password"); // ✅ hide password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ message: "Failed to get user" });
  }
};

export const RefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const user = await userModel.findOne({ refreshToken });

    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Expired or invalid token" });

      const accessToken = generateAccessToken(decoded.id);

      res.json({ accessToken });
    });

  } catch (err) {
    console.error("Refresh Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const VerifyEmail = async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send("Token missing");

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(404).send("User not found");
    if (user.verified) return res.send("Email already verified");

    user.verified = true;
    user.emailToken = null; // optional
    await user.save();

    res.send("Email verified successfully! You can now login.");
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid or expired token");
  }
};
//Forgot Password and recovery system 
export const ForgotPassword = async (req, res) => {
  const { email } = req.body;
console.log("FORGOT PASSWORD BODY:", req.body);

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not found" });

  // Generate token
  const { token, hashed } = generateResetToken();
user.resetPasswordToken = hashed;
user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

const resetUrl =`http://localhost:5173/reset-password/${token}`;

  await sendResetEmail(user.email, resetUrl);

  res.json({ message: "Password reset email sent" });
};


export const sendResetEmail = async (email, url) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click to reset password:</p><a href="${url}">${url}</a>`,
  });
};


// Route: POST /api/reset-password/:token
export const ResetPassword = async (req, res) => {
  try {
    const token = req.params.token?.trim();
    const { password } = req.body;

    if (!token) return res.status(400).json({ message: "Token is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    // Hash the token to match the stored hashed reset token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with valid reset token and not expired
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // Assign plain password — the pre('save') hook will hash it automatically
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Save user (password will be hashed automatically)
    await user.save();

    res.status(200).json({ message: "Your password has been reset. Please login with your new password." });
  } catch (err) {
    console.error("ResetPassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
