'use strict';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import passportJWT from 'passport-jwt';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (user === null)
        return done(null, false, { message: 'Incorrect credentials.' });

      const validate = await bcrypt.compare(password, user.password);
      if (!validate)
        return done(null, false, { message: 'Incorrect credentials.' });

      const strippedUser = user.toObject();
      delete strippedUser.password;

      return done(null, strippedUser, { message: 'Logged in successfully' });
    } catch (err) {
      return done(err);
    }
  })
);

// JWT strategy for handling bearer token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'builders123',
    },
    async (jwtPayload, done) => {
      console.log('payload', jwtPayload);
      //find the user in db if needed
      try {
        const user = await User.findById(jwtPayload._id, '-password -__v');
        console.log('pl user', user);

        return user !== null ? done(null, user) : done(null, false);
      } catch (e) {
        return done(null, false);
      }
    }
  )
);

export default passport;
