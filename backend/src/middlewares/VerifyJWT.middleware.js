import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyJWT = (req, res, next) => {
  let token = null;
  const authHeader = req.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Forbidden: Invalid or expired token" });
    }
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  });
};

export default verifyJWT;