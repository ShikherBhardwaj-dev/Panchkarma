const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const config = require("./default.json");

// Load environment variables
require("dotenv").config();

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || config.googleClientId,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || config.googleClientSecret,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || config.googleCallbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if user exists with same email but different provider
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.provider = "google";
          // Backfill missing name if needed
          if (!user.name || !String(user.name).trim()) {
            const primaryEmail =
              (profile.emails &&
                profile.emails[0] &&
                profile.emails[0].value) ||
              user.email ||
              "";
            let displayName = profile.displayName;
            if (!displayName) {
              const given =
                profile.name && profile.name.givenName
                  ? profile.name.givenName
                  : "";
              const family =
                profile.name && profile.name.familyName
                  ? profile.name.familyName
                  : "";
              displayName = `${given} ${family}`.trim();
            }
            if (!displayName && primaryEmail) {
              const local = String(primaryEmail).split("@")[0];
              displayName = local
                .replace(/[._-]+/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
            }
            user.name = displayName || user.name || "Google User";
          }
          await user.save();
          return done(null, user);
        }

        // Create new user with name fallback
        const primaryEmail =
          (profile.emails && profile.emails[0] && profile.emails[0].value) ||
          "";
        let displayName = profile.displayName;
        if (!displayName) {
          const given =
            profile.name && profile.name.givenName
              ? profile.name.givenName
              : "";
          const family =
            profile.name && profile.name.familyName
              ? profile.name.familyName
              : "";
          displayName = `${given} ${family}`.trim();
        }
        if (!displayName && primaryEmail) {
          const local = String(primaryEmail).split("@")[0];
          displayName = local
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }
        if (!displayName) displayName = "Google User";

        user = new User({
          googleId: profile.id,
          name: displayName,
          email: primaryEmail,
          provider: "google",
          userType: "patient", // Default to patient, can be changed later
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
