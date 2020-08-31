const moment = require('moment')
moment.locale('pt-br')

module.exports = app => {
    const Get = (req, res) => {
        app.db('weight_table').where({ user_id: req.user.id }).select('id', 'title', 'date')
            .then(weightUser => {
                if (weightUser.length <= 0) return res.json([])

                res.send(weightUser)
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

        const trx = await app.db.transaction()
        try {
            await trx('weight_table').insert({
                title,
                date: moment(new Date()).format('ddd, DD [de] MMM'),
                created_at: new Date(),
                user_id: req.user.id
            })


            trx.commit()
            res.status(200).json({ message: 'Seu peso foi cadastrado.' })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao inserir o seu peso.' })
        }
    }

    const Delete = async (req, res) => {
        if (!req.params.id) return res.status(400).json({ message: 'Id de peso inválido.' })

        try {
            app.db('weight_table')
                .where({ user_id: req.user.id, id: req.params.id })
                .del()
                .then(_ => {
                    res.status(200).json({ message: 'Seu peso foi deletado com sucesso.' })
                })
                .catch(_ => {
                    res.status(400).json({ message: 'Não foi possivel apagar esse peso.' })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao apagar o seu peso.' })
        }

    }

    return { Get, Insert, Delete }
}