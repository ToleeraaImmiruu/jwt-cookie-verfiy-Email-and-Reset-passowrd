import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies.token; // ✅ Read token from cookie

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
