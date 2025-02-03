const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile);
        const email = profile.emails[0].value;
        const emailDomain = email.split('@')[1];

        if (emailDomain !== 'vnrvjiet.in') {
          return done(null, false, { message: 'Unauthorized domain' });
        }

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: email,
            name: profile.displayName,
          });
          await user.save();
          console.log("User saved:", user);
        } else {
          console.log("User already exists:", user);
        }
        done(null, user);
      } catch (err) {
        console.error("Error during Google authentication:", err);
        done(err, null);
      }
    }
  )
);