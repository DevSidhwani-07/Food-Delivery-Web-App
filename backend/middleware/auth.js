// import jwt from "jsonwebtoken"

// const authMiddleware = async (req,res,next) => {
//     const {token} = req.headers;
//     if (!token) {
//         return res.json({success:false,message:"Not Authorized Login Again"});
//     }

//     try {
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = token_decode.id;
//         next();

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"Error"});
//     }
// }

// export default authMiddleware;




import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.token;
    if (!token) return res.json({ success: false, message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        return res.json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;
