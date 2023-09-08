const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    // Get data
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    // Create an entry for the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Send a success response
    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    // Data fetch
    const { email, password } = req.body;

    // Validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the details carefully",
      });
    }

    // Check for a registered user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    // Verify password & generate a JWT token
    if (await bcrypt.compare(password, user.password)) {
      // Password match
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
 

      user.token = token;
      await user.save();
      user.password = undefined; // Remove password from the user object
      const response = {
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: user.token,
          role: user.role,
          __v: user.__v,
        },
        message: "User logged in successfully",
      };
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 1000),
        httpOnly: true,
      }; 

      res.cookie("token", token, options).status(200).json({response});
    } else {
      // Password does not match
      return res.status(403).json({
        success: false,
        message: "Password does not match",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Login failure",
    });
  }
};
