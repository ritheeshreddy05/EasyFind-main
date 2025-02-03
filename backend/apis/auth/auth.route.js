const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

// Controller functions
const handleGoogleCallback = (req, res) => {
  try {
    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      hasPassword: req.user.hasPassword
    };
    
    const token = jwt.sign({ 
      id: user.id,
      user: user 
    }, process.env.JWT_SECRET);

    // Redirect to login with auth params
    res.redirect(
      `${process.env.FRONTEND_URL}/login?` + 
      `token=${token}&` + 
      `userData=${encodeURIComponent(JSON.stringify(user))}&` +
      `auth=success`
    );
  } catch (error) {
    console.error('Google auth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?auth=failed`);
  }
};

const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    user.password = password;
    user.hasPassword = true;
    await user.save();
    res.json({ message: "Password set successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message)}`
        );
      }
      
      if (!user) {
        const errorMessage = info?.message || 'Authentication failed';
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(errorMessage)}`
        );
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  handleGoogleCallback
);
router.post("/set-password", setPassword);

module.exports = router;