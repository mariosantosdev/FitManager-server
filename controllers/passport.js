const { secretKey } = require('../.env')
const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')

const opts = {
    secretOrKey: secretKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = app => {
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