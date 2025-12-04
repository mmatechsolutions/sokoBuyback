import User from "../Schemas/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, dob, gender, phone, email, password } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !phone ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with email or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      dob,
      gender,
      phone,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .json({ user: newUser, token, message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// SIGNIN
export const signin = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user, token, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
