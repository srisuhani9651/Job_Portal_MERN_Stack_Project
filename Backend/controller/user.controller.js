import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import { sendOtpEmail } from "../utils/email.js";
import {
  generateTOTP,
  verifyTOTP,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "../utils/totp.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "Missing the required field", success: false });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: `User already exists with this ${email}` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile photo to Cloudinary during signup (if provided)
    let profilePhotoUrl = "";
    const files = req.files || (req.file ? [req.file] : []);
    const photoFile = files.find(
      (f) => f.fieldname === "file" || f.fieldname === "profilePhoto"
    );
    if (photoFile) {
      const fileUri = `data:${photoFile.mimetype};base64,${photoFile.buffer.toString("base64")}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    return res
      .status(201)
      .json({ message: "Account created successfully!", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Missing the required field", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect Email or Password!", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect Email or Password!", success: false });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role!",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome back ${user.fullName}`, user, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logout successfully!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;

    let skillsArray;
    if (skills) {
      skillsArray = typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : skills;
    }

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // Update basic user details
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (skillsArray) user.profile.skills = skillsArray;

    // Upload files to Cloudinary (profile photo and/or resume)
    const files = req.files || (req.file ? [req.file] : []);
    for (const file of files) {
      //dataUri parser
      const fileUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      if (
        file.fieldname === "profilePhoto" ||
        (file.fieldname === "file" && file.mimetype.startsWith("image/"))
      ) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
          resource_type: "image",
          folder: "job_portal_avatars",
        });
        user.profile.profilePhoto = cloudResponse.secure_url;
      } else {
        // Uploads PDF using Cloudinary image/pdf resource type to preserve vector hyperlinks
        const cleanName = (file.originalname || "resume.pdf")
          .replace(/\.pdf$/i, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_");

        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
          resource_type: "image",
          format: "pdf",
          folder: "job_portal_resumes",
          public_id: `${Date.now()}_${cleanName}`,
          access_mode: "public",
          type: "upload",
        });

        console.log("[Cloudinary Resume Upload]:", {
          resource_type: cloudResponse.resource_type,
          format: cloudResponse.format,
          delivery_type: cloudResponse.type,
          secure_url: cloudResponse.secure_url,
          bytes: cloudResponse.bytes,
        });

        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = file.originalname;
      }
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const changePassword = async (req, res) => {
  const { oldPass, newPass, email } = req.body;
  try {
    if (!oldPass || !newPass || !email) {
      return res
        .status(400)
        .json({ message: "something is missing", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user doesn't exist", success: false });
    }

    const matchPass = await bcrypt.compare(oldPass, user.password);
    if (!matchPass) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    await User.updateOne({ email }, { password: hashedPass });

    return res
      .status(200)
      .json({ message: "Password has successfully changed", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong", success: false });
  }
};

// Generates stateless 30-second HMAC-based TOTP and emails it to the user
export const sendResetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[Forgot Password] Received OTP request for email: "${email}"`);

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Case-insensitive lookup ensures user is matched regardless of storage casing
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    // Returns a generic success response to prevent user enumeration
    if (!user) {
      console.log(`[Forgot Password] No account found for email: "${normalizedEmail}". Generic success response sent.`);
      return res.status(200).json({
        message: "If an account with that email exists, an OTP has been sent.",
        success: true,
      });
    }

    // Derives stateless 30-second OTP using HMAC without DB storage
    const targetEmail = user.email.toLowerCase().trim();
    const otp = generateTOTP(targetEmail);
    console.log(`[Forgot Password] OTP successfully generated for recipient: "${targetEmail}"`);

    // Sends OTP to registered email via Gmail SMTP
    const emailResult = await sendOtpEmail(targetEmail, otp);
    console.log(`[Forgot Password] Email dispatch completed with status:`, emailResult.success ? "SUCCESS" : "FAILED/FALLBACK");

    return res.status(200).json({
      message: "If an account with that email exists, an OTP has been sent.",
      success: true,
    });
  } catch (error) {
    console.error("sendResetPasswordOtp error:", error);
    return res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again.", success: false });
  }
};

// Verifies stateless TOTP with rate limiting against brute force attempts
export const verifyResetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enforces rate-limiting attempt protection
    const rateCheck = checkRateLimit(normalizedEmail);
    if (!rateCheck.allowed) {
      return res.status(429).json({ message: rateCheck.message, success: false });
    }

    // Compares submitted OTP with derived HMAC-TOTP
    const isValid = verifyTOTP(normalizedEmail, otp);
    if (!isValid) {
      recordFailedAttempt(normalizedEmail);
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP (valid for 30 seconds)", success: false });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("verifyResetPasswordOtp error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// Verifies TOTP, validates password strength, and updates user password in MongoDB
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enforces rate-limiting attempt protection
    const rateCheck = checkRateLimit(normalizedEmail);
    if (!rateCheck.allowed) {
      return res.status(429).json({ message: rateCheck.message, success: false });
    }

    // Validates password criteria (min 8 chars, uppercase, lowercase, number, special char)
    const isStrongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPassword);
    if (!isStrongPassword) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
        success: false,
      });
    }

    // Re-derives and validates TOTP mathematically
    const isValid = verifyTOTP(normalizedEmail, otp);
    if (!isValid) {
      recordFailedAttempt(normalizedEmail);
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP (valid for 30 seconds)", success: false });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    // Hashes new password and updates user document
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clears rate limit attempt counter upon successful password reset
    resetRateLimit(normalizedEmail);

    return res.status(200).json({
      message: "Password reset successfully. You can now log in.",
      success: true,
    });
  } catch (error) {
    console.error("resetPasswordWithOtp error:", error);
    return res
      .status(500)
      .json({ message: "Failed to reset password. Please try again.", success: false });
  }
};

