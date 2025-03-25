import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

const loginUser = async (req, res) => {
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
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch(error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  export default loginUser;