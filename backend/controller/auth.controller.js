import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { username, email, password, country, profileImage } = req.body;
  if (!username || !email || !password || !country || !profileImage) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User Already Exist" });
    }

    //hasing password
    const hashedPassword = await bcrypt.hash(password, 10);
    //creating user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      country,
      profileImage,
    });

    //creating token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //respond
    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        country: newUser.country,
        profileImage: newUser.profileImage,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//LOGIN FUNCTION

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //checking if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials !" });
    }
    //matching password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid Credentials !" });
    }

    //creating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // respond with user + token
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        country: user.country,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
