const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const config = require('config');
const User = require('../model/Users');
const secretOrKey = config.get('secretOrKey');
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey,
};

passport.initialize();
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('jwt_payload', jwt_payload)
    const { _id } = jwt_payload;
    // console.log('_id', _id)
    try {
      const user = await User.findById(_id).select('-password');
      user ? done(null, user) : done(null, false);
      console.log('user', user)
    } catch (error) {
      console.error(error);
    }
  })
);
module.exports = isAuth = () => passport.authenticate('jwt', { session: false });
