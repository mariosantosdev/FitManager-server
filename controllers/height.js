const moment = require('moment')
moment.locale('pt-br')

module.exports = app => {
    const Get = (req, res) => {
        app.db.findOne({ email: req.user.email })
            .then(userFounded => {
                if (!userFounded) return res.status(200).json([])
                res.status(200).json({ height: userFounded.height })
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar seus pesos.' })
            })
    }

    const Insert = async (req, res) => {
        const { title, date } = req.body

        if (!title || title.trim() == '') return res.status(400).json({ message: 'Você precisa informar a sua altura.' })
        if (!date || date.trim() == '') return res.status(400).json({ message: 'Você precisa informar uma data.' })

        try {
            app.db.find({ email: req.user.email }).select('height')
                .then(heightArray => {
                    if (!heightArray || heightArray === undefined || heightArray === []) heightArray = []

                    app.db.findById(req.user._id, (err, user) => {
                        if (err) {
                            app.logger.error(err, __filename)
                            res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar o seu usuário.' })
                        }

                        user.height.push({
                            title,
                            date: moment(date).format('ddd, DD [de] MMM [de] YYYY'),
                            created_at: date,
                        })
                        user.save((err) => {
                            if (err) {
                                app.logger.error(err, __filename)
                                res.status(500).json({ message: 'Ocorreu um erro no servidor ao salvar a sua altura.' })
                            }
                            res.status(200).json({ message: 'Sua altura foi cadastrado.' })
                        })
                    })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao inserir a sua altura.' })
        }
    }

    const Delete = async (req, res) => {
        if (!req.params.id) return res.status(400).json({ message: 'Id de peso inválido.' })

        try {
            app.db.find({ email: req.user.email }).select('height')
                .then(heightArray => {
                    if (!heightArray || heightArray === undefined || heightArray === []) heightArray = []

                    app.db.findById(req.user._id, (err, user) => {
                        if (err) {
                            app.logger.error(err, __filename)
                            res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar o seu usuário.' })
                        }

                        user.height.forEach((elemExercise, indexExercise) => {
                            if (elemExercise._id == req.params.id) {
                                return user.height.splice(indexExercise, 1)
                            }
                        })
                        user.save((err) => {
                            if (err) {
                                app.logger.error(err, __filename)
                                res.status(400).json({ message: 'Não foi possivel apagar essa altura.' })
                            }
                            res.status(200).json({ message: 'Sua altura foi deletado com sucesso.' })
                        })
                    })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao apagar a sua altura.' })
        }

    }

    return { Get, Insert, Delete }
}