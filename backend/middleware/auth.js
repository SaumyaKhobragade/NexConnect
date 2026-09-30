import User from "../models/users.model.js";

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const user = await User.findOne({ token, active: true }).select(
            "-password",
        );
        if (!user) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(500).json({ message: "Authentication error" });
    }
};

export default auth;
