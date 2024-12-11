
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Adjust the path as needed

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from header
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Fetch user from database or use the decoded data
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Add user to the request object
    next(); // Proceed to the next middleware or route handler
  });
};


const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    console.log("userRole", userRole)

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied. Insufficient role" });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };
