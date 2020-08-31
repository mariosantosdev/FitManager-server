const moment = require('moment')
moment.locale('pt-br')
const jwt = require('jwt-simple')
const bcrypt = require('bcryptjs')
const convert = require('convert-units')
const calculator = require('fasam-imc-calc')

const imc = new calculator()

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

    const RemoveUnitFromString = (array) => {
        variable = array.title.split('').map(letter => {
            if (!isNaN(letter)) return letter
        })

        return Number(variable.join(''))
    }

    const Get = (req, res) => {
        app.db('users_table').where({ id: req.user.id }).select('id', 'name', 'email', 'created_at')
            .then(usersUser => {
                if (usersUser.length <= 0) return res.json([])

                res.status(200).json(usersUser)
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar seu perfil.' })
            })
    }

    const GetDateFromHomePage = async (req, res) => {
        let jsonToReturnWithData = {}
        let weight, height

        try {
            const [weightFromDB] = await app.db('weight_table').where({ user_id: req.user.id }).limit(1).orderBy('created_at', 'desc').select('title')
            const [heightFromDB] = await app.db('height_table').where({ user_id: req.user.id }).limit(1).orderBy('created_at', 'desc').select('title')

            weight = RemoveUnitFromString(weightFromDB)
            height = convert(RemoveUnitFromString(heightFromDB)).from('cm').to('m')

            jsonToReturnWithData.IMC = Number(imc.calc(weight, height))
            jsonToReturnWithData.weight = weight
            jsonToReturnWithData.height = RemoveUnitFromString(heightFromDB)
            res.status(200).json(jsonToReturnWithData)
        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({message: 'Ocorreu um erro no servidor ao procurar suas informações.'})
        }

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
                    const token = jwt.encode(payload, app.secretKey)
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

    return { Get, GetDateFromHomePage, Update, Delete }
}