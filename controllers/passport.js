require('dotenv').config()
const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')

module.exports = app => {
    const opts = {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    passport.use(new Strategy(opts, (payload, done) => {
        app.db('users_table').where({ id: payload.id })
            .then(user => {
                if (user.length <= 0) return done(null, false)

                const { id, name, email } = user[0]
                return done(null, { id, name, email })
            })
            .catch(err => done(err, false))
    }))

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}