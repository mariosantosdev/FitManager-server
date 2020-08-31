const moment = require('moment')
moment.locale('pt-br')

module.exports = app => {
    const Get = (req, res) => {
        app.db('height_table').where({ user_id: req.user.id }).select('id', 'title', 'date')
            .then(heightUser => {
                if (heightUser.length <= 0) return res.json([])

                res.send(heightUser)
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar sua altura.' })
            })
    }

    const Insert = async (req, res) => {
        const { title, date } = req.body

        if (!title || title.trim() == '') return res.status(400).json({ message: 'Você precisa informar o sua altura.' })
        if (!date || date.trim() == '') return res.status(400).json({ message: 'Você precisa informar uma data.' })

        const trx = await app.db.transaction()
        try {
            await trx('height_table').insert({
                title,
                date: moment(date).format('ddd, DD [de] MMM'),
                created_at: date,
                user_id: req.user.id
            })


            trx.commit()
            res.status(200).json({ message: 'Sua altura foi cadastrado.' })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao inserir o sua altura.' })
        }
    }

    const Delete = async (req, res) => {
        if (!req.params.id) return res.status(400).json({ message: 'Id da altura inválido.' })

        try {
            app.db('height_table')
                .where({ user_id: req.user.id, id: req.params.id })
                .del()
                .then(_ => {
                    res.status(200).json({ message: 'sua altura foi deletado com sucesso.' })
                })
                .catch(_ => {
                    res.status(400).json({ message: 'Não foi possivel apagar essa altura.' })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao apagar o sua altura.' })
        }

    }

    return { Get, Insert, Delete }
}