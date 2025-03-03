import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerPage = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.error(`Failed to load registration page: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

const loginPage = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error(`Failed to load login page: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

const postRegisterPage = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Input Validation
    if (!name || !email || !password) {
      return res.status(400).send("Name, email, and password are required.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    await User.create(newUser);
    res.redirect("/login");
  } catch (error) {
    console.error(`Failed to create user: ${error}`);
    res.status(500).send("Failed to create user."); // Internal Server Error
  }
};

const postLoginPage = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("Email do not exist");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send("Invalid password");
    }

    // JWT Implementation
    const payload = {
      user: {
        id: user.id, // Include the user ID in the payload
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect("/protected");
  } catch (error) {
    console.error(`Failed to login user: ${error}`);
    res.status(500).send("Failed to login user.");
  }
};

const protectedPage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // To not show the password
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("protected", { user });
  } catch (error) {
    console.error(`Failed to load protected page: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

export {
  registerPage,
  loginPage,
  postRegisterPage,
  postLoginPage,
  protectedPage,
};
