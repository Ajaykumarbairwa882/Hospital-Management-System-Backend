import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token required",
      });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hms_secret_key");

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default auth;
