import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "Missing the required field", success: false });
    }
    // now will check is user exist with same id from which he is getting register himseslf
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: `User already exists with this ${email}` });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
    return res
      .status(201)
      .json({ message: `Account created successfully!`, success: true });
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
    //check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn.t exist with current role!",
        success: false,
      });
    }

    // now generate the token, search why we generate the token

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
      .json({ message: `Welcome back ${user.fullName}`,user, success: true });
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
      .json({ message: `Logout successfully!`, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    // const file = req.file;

    //cloudinary comes here(jo file milegi usko yha setup krege)
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: `User not found`, success: false });
    }
    //update data
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    //resume upload later on

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .json({ message: `Profile updated successfully`, user:updatedUser, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success:false });
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
