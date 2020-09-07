require('dotenv').config()
const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')

module.exports = app => {
    const opts = {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    passport.use(new Strategy(opts, async (payload, done) => {
        app.db.findOne({ email: payload.email })
            .then(user => {
                if (!user) return done(null, false)

                const { _id, name, email } = user
                return done(null, { _id, name, email })
            })
            .catch(err => {
                console.log(err);
                return done(err, false)
            })
    }))

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}