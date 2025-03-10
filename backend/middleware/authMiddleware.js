// middleware/authMiddleware.js
import jwt from 'jsonwebtoken'; // Import jwt for verifying the token

export const protect = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify JWT token (replace with your own JWT secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded.user; // Attach the decoded user to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
