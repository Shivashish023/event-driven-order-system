import { User } from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
const register = (async (req, res) => {
    try {
    const { name, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = generateToken(user._id);
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 
const login =(async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
        
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { register, login, logout };