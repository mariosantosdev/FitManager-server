const moment = require('moment')
moment.locale('pt-br')

module.exports = app => {
    const Get = (req, res) => {
        app.db.findOne({ email: req.user.email })
            .then(userFounded => {
                if (!userFounded) return res.status(200).json([])
                res.status(200).json({ exercise: userFounded.exercise })
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar seus exercícios.' })
            })
    }

    const Insert = async (req, res) => {
        const { title, day_of_week, loop, delay_time } = req.body

        if (!title || title.trim() == '') return res.status(400).json({ message: 'Você precisa informar o seu exercício.' })
        if (!day_of_week || day_of_week.trim() == '') return res.status(400).json({ message: 'Você precisa informar uma data.' })

        try {
            app.db.find({ email: req.user.email }).select('exercise')
                .then(exerciseArray => {
                    if (!exerciseArray || exerciseArray === undefined || exerciseArray === []) exerciseArray = []

                    app.db.findById(req.user._id, (err, user) => {
                        if (err) {
                            app.logger.error(err, __filename)
                            res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar o seu usuário.' })
                        }

                        user.exercise.push({
                            title,
                            day_of_week: day_of_week.toLowerCase(),
                            loop,
                            delay_time,
                            created_at: new Date()
                        })
                        user.save((err) => {
                            if (err) {
                                app.logger.error(err, __filename)
                                res.status(500).json({ message: 'Ocorreu um erro no servidor ao salvar o seu exercício.' })
                            }
                            res.status(200).json({ message: 'Seu exercício foi cadastrado.' })
                        })
                    })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao inserir o seu exercício.' })
        }
    }

    const Delete = async (req, res) => {
        if (!req.params.id) return res.status(400).json({ message: 'Id de exercício inválido.' })

        try {
            app.db.find({ email: req.user.email }).select('exercise')
                .then(exerciseArray => {
                    if (!exerciseArray || exerciseArray === undefined || exerciseArray === []) exerciseArray = []

                    app.db.findById(req.user._id, (err, user) => {
                        if (err) {
                            app.logger.error(err, __filename)
                            res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar o seu usuário.' })
                        }

                        user.exercise.forEach((elemExercise, indexExercise) => {
                            if (elemExercise._id == req.params.id) {
                                return user.exercise.splice(indexExercise, 1)
                            }
                        })
                        user.save((err) => {
                            if (err) {
                                app.logger.error(err, __filename)
                                res.status(400).json({ message: 'Não foi possivel apagar esse exercício.' })
                            }
                            res.status(200).json({ message: 'Seu exercício foi deletado com sucesso.' })
                        })
                    })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao apagar o seu exercício.' })
        }

    }

    return { Get, Insert, Delete }
}