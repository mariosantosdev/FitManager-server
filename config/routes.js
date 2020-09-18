module.exports = app => {
    app.get('/', (req, res) => {
        res.sendFile(`${__dirname}/index.html`)
    })

    app.post('/signup', app.controllers.signup)
    app.post('/signin', app.controllers.signin)
    app.post('/forgot', app.controllers.user.Forgot)

    app.route('/weight')
        .all(app.controllers.passport.authenticate())
        .get(app.controllers.weight.Get)
        .post(app.controllers.weight.Insert)

    app.route('/exercise')
        .all(app.controllers.passport.authenticate())
        .get(app.controllers.exercise.Get)
        .post(app.controllers.exercise.Insert)

    app.route('/height')
        .all(app.controllers.passport.authenticate())
        .get(app.controllers.height.Get)
        .post(app.controllers.height.Insert)

    app.route('/user')
        .all(app.controllers.passport.authenticate())
        .get(app.controllers.user.Get)
        .put(app.controllers.user.Update)
        .delete(app.controllers.user.Delete)

    app.route('/user/info')
        .all(app.controllers.passport.authenticate())
        .get(app.controllers.user.GetDateFromHomePage)

    // Delete and Update

    app.route('/weight/:id')
        .all(app.controllers.passport.authenticate())
        .delete(app.controllers.weight.Delete)

    app.route('/exercise/:id')
        .all(app.controllers.passport.authenticate())
        .delete(app.controllers.exercise.Delete)

    app.route('/height/:id')
        .all(app.controllers.passport.authenticate())
        .delete(app.controllers.height.Delete)

    // Routes Log
    app.route('/logs/:type')
        .get(app.controllers.logs)
}