const moment = require('moment')
moment.locale('pt-br')

module.exports = app => {
    const Get = (req, res) => {
        app.db('exercise_table').where({ user_id: req.user.id }).select('id', 'title', 'day_of_week', 'loop', 'delay_time')
            .then(exerciseUser => {
                if (exerciseUser.length <= 0) return res.json([])

                res.send(exerciseUser)
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

        const trx = await app.db.transaction()
        try {
            await trx('exercise_table').insert({
                title,
                day_of_week: moment(new Date()).format('dddd').toLowerCase(),
                loop,
                delay_time,
                created_at: new Date(),
                user_id: req.user.id
            })


            trx.commit()
            res.status(200).json({ message: 'Seu exercício foi cadastrado.' })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao inserir o seu exercício.' })
        }
    }

    const Delete = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ message: 'Id de exercício inválido.' })

        try {
            app.db('exercise_table')
                .where({ user_id: req.user.id, id: req.params.id })
                .del()
                .then(_ => {
                    res.status(200).json({ message: 'Seu exercício foi deletado com sucesso.' })
                })
                .catch(_ => {
                    res.status(400).json({ message: 'Não foi possivel apagar esse exercício.' })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao apagar o seu exercício.' })
        }

    }

    return { Get, Insert, Delete }
}