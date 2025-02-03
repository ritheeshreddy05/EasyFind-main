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
        const email = profile.emails[0].value;
        const emailDomain = email.split('@')[1];

        if (emailDomain !== 'vnrvjiet.in') {
          return done(null, false, { 
            message: 'Access restricted to vnrvjiet.in domain only',
            type: 'UNAUTHORIZED_DOMAIN' 
          });
        }

        let user = await User.findOne({ googleId: profile.id });
        // ...existing code...
      } catch (error) {
        done(error);
      }
    }
  )
);