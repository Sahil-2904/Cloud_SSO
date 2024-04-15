// app.js

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const app = express();

// Configure Passport to use Google OAuth2
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Here you can create or update a user in your database and return the user's info
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    };
    return done(null, user);
  }
));

// Serialize user into a token
passport.serializeUser((user, done) => {
  const token = jwt.sign(user, 'YOUR_SECRET_KEY');
  done(null, token);
});

// Deserialize user from token
passport.deserializeUser((token, done) => {
  jwt.verify(token, 'YOUR_SECRET_KEY', (err, user) => {
    if (err) return done(err, null);
    done(null, user);
  });
});

// Initialize Passport
app.use(passport.initialize());

// Google OAuth2 authentication route
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth2 callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to frontend with token in URL
    res.redirect(`http://localhost:3000/auth/callback?token=${req.user}`);
  }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
