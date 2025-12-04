import userModel from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const Register = async (req, res) => {
  const { email, name, password } = req.body;
  console.log(req.body)

  try {
    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.status(404).json({
        message: "User already existing", 
        
      })
      
    }
    const user = await userModel.create({ email, name, password })
    res.status(201).json(user)
    console.log("The user was saved to database successfully ");

  } catch (err) {
    console.log(err)
    res.status(404).send("The user was not created");

  }
}

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password was not match" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );


    res.cookie("token", token, {
      httpOnly: true,   
      secure: false,    
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const Logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
