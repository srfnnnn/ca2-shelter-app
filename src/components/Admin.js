const express = require("express");
const router = express.Router();

// POST /admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    // Save admin info in session
    req.session.isAdmin = true;
    req.session.email = email;
    return res.json({ success: true, message: "Logged in successfully" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
});

// POST /admin/logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: "Failed to logout" });
    res.json({ success: true, message: "Logged out" });
  });
});

// Middleware to protect admin routes
function adminAuth(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Forbidden: Admins only" });
  }
}

module.exports = { router, adminAuth };
