const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(
  new GoogleStrategy(
    {
      clientID:"470339623106-pqejtojp4aqjntl9cmkq4k1lid0oeis5.apps.googleusercontent.com",      // Must match your env
      clientSecret: "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", // Must match your env
      callbackURL: process.env.GOOGLE_CALLBACK_URL,   // Must match Google console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user based on Google profile
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
        }
        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return done(null, { ...user.toObject(), token }); // Pass user + token
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
