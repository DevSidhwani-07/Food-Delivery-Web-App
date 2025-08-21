import jwt from "jsonwebtoken";

// Middleware function to check if user is authorized
const authMiddleware = (req, res, next) => {
    const token = req.headers.token;

     // If no token is provided, deny access
    if (!token) return res.json({ success: false, message: "Not authorized" });

    try {

         // Verify token using JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;
