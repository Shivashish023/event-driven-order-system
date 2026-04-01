import jwt from "jsonwebtoken";
const protect = async (req, res, next) => {
    try {   
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
} catch (error) {
    return res.status(401).json({ message: error.message });
}
}
export default protect;