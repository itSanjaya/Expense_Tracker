import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // no token
    if (!token) {
      return res.status(401).json({
        data: null,
        error: "Not authenticated",
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user
    req.user = decoded; // { id: user.id }

    next();
  } catch (error) {
    return res.status(401).json({
      data: null,
      error: "Invalid token",
    });
  }
};

export default authMiddleware;