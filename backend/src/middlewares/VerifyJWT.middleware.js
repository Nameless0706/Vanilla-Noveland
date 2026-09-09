import jwt from "jsonwebtoken";
import "dotenv/config";

const extractToken = (req) => {
  const authHeader = req.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  return null;
};

export const verifyJWT = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid or expired token" });
    }
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  });
};

export const optionalAuth = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.userId = decoded.userId;
      req.user = decoded;
    }
    next();
  });
};

export default verifyJWT;