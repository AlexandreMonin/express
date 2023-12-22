import User from '../class/user';
import passport from 'passport';
import { ExtractJwt, Strategy } from "passport-jwt";

const params = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
};

passport.use(
    new Strategy(params, (jwt_payload, done) => {
        if (jwt_payload.user) {
            return done(null, jwt_payload.user);
        }

        return done(null, false);
    })
);