const { secretKey } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcryptjs')
const moment = require('moment')
moment.locale('pt-br')

module.exports = app => {
    // Funcao para gerar uma hash da senha
    const GenerateHash = (password, callback) => {
        return new Promise(resolve => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return new Error(err)
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return new Error(err)
                    resolve(hash)
                })
            })
        })
    }

    const Get = (req, res) => {
        app.db('users_table').where({ id: req.user.id }).select('id', 'name', 'email', 'avatar')
            .then(usersUser => {
                if (usersUser.length <= 0) return res.json([])

                res.status(200).json(usersUser)
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar seu perfil.' })
            })
    }

    const Update = async (req, res) => {
        try {
            if (req?.body?.password && req?.body?.password.trim() !== '') req.body.password = await GenerateHash(req.body.password)

            app.db('users_table')
                .where({ id: req.user.id })
                .update(req.body)
                .then(async usersUser => {
                    if (usersUser.length <= 0) return res.json([])

                    const user = await app.db('users_table').where({ id: req.user.id })
                    const payload = { id: user[0].id }
                    const token = jwt.encode(payload, secretKey)
                    res.status(200).json({ message: 'Seu perfil foi atualizado.', token })
                })
                .catch(err => {
                    app.logger.error(err, __filename)
                    res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar seu perfil.' })
                })

        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao atualizar o seu perfil.' })
        }
    }

    const Delete = async (req, res) => {
        try {
            app.db('users_table')
                .where({ id: req.user.id })
                .del()
                .then(_ => {
                    res.status(200).json({ message: 'Seu perfil foi deletado com sucesso.' })
                })
                .catch(_ => {
                    res.status(400).json({ message: 'Não foi possivel apagar esse perfil.' })
                })
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao apagar o seu perfil.' })
        }

    }

    return { Get, Update, Delete }
}