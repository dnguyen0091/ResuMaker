import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

export const registerUser = async (req, res) => {
  const { firstName, lastName, login, password } = req.body;

  try {
    const userExists = await User.findOne({ login });
    if(userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ firstName, lastName, login, password });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      login: user.login,
      token: generateToken(user._id),
    });
  } catch(error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export const loginUser = async (req, res) => {
  const { login, password } = req.body

  try {
    const user = await User.findOne({ login });

    if(user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch(error) {
    res.status(500).json({ message: "Server error", error });
  }
}