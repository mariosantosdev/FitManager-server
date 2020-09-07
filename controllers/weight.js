const moment = require('moment')
moment.locale('pt-br')

module.exports = app => {
    const Get = (req, res) => {
        app.db.findOne({ email: req.user.email })
            .then(userFounded => {
                if (!userFounded) return res.status(200).json([])
                res.status(200).json({ weight: userFounded.weight })
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar seus pesos.' })
            })
    }

    const Insert = async (req, res) => {
        const { title, date } = req.body

        if (!title || title.trim() == '') return res.status(400).json({ message: 'Você precisa informar o seu peso.' })
        if (!date || date.trim() == '') return res.status(400).json({ message: 'Você precisa informar uma data.' })

        try {
            app.db.find({ email: req.user.email }).select('weight')
                .then(weightArray => {
                    if (!weightArray || weightArray === undefined || weightArray === []) weightArray = []

                    app.db.findById(req.user._id, (err, user) => {
                        if (err) {
                            app.logger.error(err, __filename)
                            res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar o seu usuário.' })
                        }

                        user.weight.push({
                            title,
                            date: moment(date).format('ddd, DD [de] MMM [de] YYYY'),
                            created_at: date,
                        })
                        user.save((err) => {
                            if (err) {
                                app.logger.error(err, __filename)
                                res.status(500).json({ message: 'Ocorreu um erro no servidor ao salvar o seu peso.' })
                            }
                            res.status(200).json({ message: 'Seu peso foi cadastrado.' })
                        })
                    })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao inserir o seu peso.' })
        }
    }

    const Delete = async (req, res) => {
        if (!req.params.id) return res.status(400).json({ message: 'Id de peso inválido.' })

        try {
            app.db.find({ email: req.user.email }).select('weight')
                .then(weightArray => {
                    if (!weightArray || weightArray === undefined || weightArray === []) weightArray = []

                    app.db.findById(req.user._id, (err, user) => {
                        if (err) {
                            app.logger.error(err, __filename)
                            res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar o seu usuário.' })
                        }

                        user.weight.forEach((elemExercise, indexExercise) => {
                            if (elemExercise._id == req.params.id) {
                                return user.weight.splice(indexExercise, 1)
                            }
                        })
                        user.save((err) => {
                            if (err) {
                                app.logger.error(err, __filename)
                                res.status(400).json({ message: 'Não foi possivel apagar esse peso.' })
                            }
                            res.status(200).json({ message: 'Seu peso foi deletado com sucesso.' })
                        })
                    })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao apagar o seu peso.' })
        }

    }

    return { Get, Insert, Delete }
}