import User from '../models/User.js';
import generateToken from './generateToken.js';

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if(userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ firstName, lastName, email, password });

    return res.sendstatus(201).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token: generateToken(user._id)
    });
  } catch(error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))) {
      return res.status(200).json({
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch(error) {
    res.status(500).json({ message: "Server error", error });
  }
};