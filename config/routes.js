module.exports = app => {
    app.post('/signup', app.controllers.signup)
    app.post('/signin', app.controllers.signin)

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

    //Get Last
    app.route('/weight/last')
        .all(app.controllers.passport.authenticate())
        .get(app.controllers.weight.GetLast)

    app.route('/exercise/last')
        .all(app.controllers.passport.authenticate())
        .get(app.controllers.exercise.GetLast)

    app.route('/height/last')
        .all(app.controllers.passport.authenticate())
        .get(app.controllers.height.GetLast)

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
}