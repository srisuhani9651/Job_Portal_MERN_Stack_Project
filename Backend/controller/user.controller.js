import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

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
      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        resource_type: "auto",
      });

      if (
        file.fieldname === "profilePhoto" ||
        (file.fieldname === "file" && file.mimetype.startsWith("image/"))
      ) {
        user.profile.profilePhoto = cloudResponse.secure_url;
      } else {
        user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
        user.profile.resumeOriginalName = file.originalname; // 
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
