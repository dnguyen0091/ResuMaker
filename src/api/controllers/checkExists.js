import User from '../models/User.js';

// Check for existing email endpoint
const checkExists = async (req, res) => 
{
    const { email } = req.body;

    try 
    {
        const userExists = await User.findOne({ email });

        if (userExists)
            return res.status(400).json({ message: "Email already in use" });
        else
            return res.status(202).json({ message: "Email is unique" }); 
        
    }
    catch (error)
    {
        res.status(500).json({ message: "Server error", error});
    }
}

export default checkExists;