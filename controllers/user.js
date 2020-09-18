const moment = require('moment')
moment.locale('pt-br')
const jwt = require('jwt-simple')
const bcrypt = require('bcryptjs')
const convert = require('convert-units')
const nodemailer = require('nodemailer')
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

    const GeneratePassword = () => {
        const password = Math.random().toString(36).slice(-8)
        return password
    }

    const RemoveUnitFromString = (array) => {
        if (array === undefined) return
        let variable
        for (let i = 0; i < array.length; i++) {
            variable = array[i].title.split('').map(letter => {
                if (!isNaN(letter)) return letter
            })
        }

        return Number(variable.join(''))
    }

    const Get = (req, res) => {
        app.db.findOne({ email: req.user.email })
            .then(userFounded => {
                if (!userFounded || userFounded == undefined || userFounded == []) return res.json([])

                res.status(200).json({
                    id: userFounded._id,
                    name: userFounded.name,
                    email: userFounded.email,
                    created_at: userFounded.created_at,
                    exercise: userFounded.exercise,
                    height: userFounded.height,
                    weight: userFounded.weight,
                    backup: userFounded.backup,
                })
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar seu perfil.' })
            })
    }

    const GetDateFromHomePage = async (req, res) => {
        let jsonToReturnWithData = {}
        let newWeight, newHeight

        try {
            const { weight } = await app.db.findOne({ email: req.user.email }).limit(1).sort('created_at').select('weight')
            const { height } = await app.db.findOne({ email: req.user.email }).limit(1).sort('created_at').select('height')

            if (weight.length > 0 && height.length > 0) {
                newWeight = RemoveUnitFromString(weight)
                newHeight = convert(RemoveUnitFromString(height)).from('cm').to('m')

                jsonToReturnWithData.IMC = Number(imc.calc(newWeight, newHeight))
                jsonToReturnWithData.weight = newWeight
                jsonToReturnWithData.height = RemoveUnitFromString(height)
                res.status(200).json(jsonToReturnWithData)
            } else {
                if (weight.length == 0) return res.status(400).json({ message: 'Você não tem nenhum peso cadastrado.' })
                if (height.length == 0) return res.status(400).json({ message: 'Você não tem nenhuma altura cadastrada.' })
                res.status(400).json({ message: 'Não foi possivel encotrar suas informações.' })
            }

        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar suas informações.' })
        }

    }

    const Update = async (req, res) => {
        try {
            if (req.body.password && req.body.password.trim() !== '') req.body.password = await GenerateHash(req.body.password)

            app.db.findByIdAndUpdate(req.user._id, req.body)
                .then(async success => {
                    if (success.length <= 0) return res.json([])

                    const user = await app.db.findOne({ email: req.user.email })
                    const payload = { id: user._id }
                    const token = jwt.encode(payload, app.secretKey)
                    res.status(200).json({ message: 'Seu perfil foi atualizado.', token })
                })
                .catch(err => {
                    app.logger.error(err, __filename)
                    res.status(500).json({ message: 'Ocorreu um erro no servidor ao atualizar o seu perfil.' })
                })

        } catch (err) {
            app.logger.error(err, __filename)
            res.status(500).json({ message: 'Ocorreu um erro no servidor ao atualizar o seu perfil.' })
        }
    }

    const Delete = async (req, res) => {
        try {
            app.db.findByIdAndDelete(req.user._id)
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

    const Forgot = async (req, res) => {
        if (!req.body.email || req.body.password && req.body.password.trim() !== '') return res.status(400).json({ message: 'Nenhum email passado para a recuperação de senha.' })

        app.db.findOne({ email: req.body.email })
            .then(async userFounded => {
                if (!userFounded || userFounded == undefined || userFounded == []) return res.status(400).json({ message: 'Esse email não está cadastrado.' })

                const newPassword = GeneratePassword()
                const hashedPassword = await GenerateHash(newPassword)

                app.db.findByIdAndUpdate(userFounded._id, { password: hashedPassword })
                    .then(async success => {
                        if (success.length <= 0) return res.status(400).json({ message: 'Não foi possivel atualizar a sua senha.' })

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            secure: true,
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD_EMAIL
                            }
                        })

                        const mail = {
                            from: process.env.EMAIL,
                            to: req.body.email,
                            subject: 'Recuperação de senha Fit Manager',
                            html: `Olá ${userFounded.name} sua nova senha para acessar o app Fit Manager é <b>${newPassword}<b>`
                        }

                        transporter.sendMail(mail, (err) => {
                            if (err) {
                                app.logger.error(err, __filename)
                                return res.status(500).json({ message: 'Ocorreu um erro no servidor ao enviar a sua nova senha para o seu email.' })
                            }

                            res.json({message: 'Sua nova senha foi enviada para o seu email, verifique a caixa de spam.'})
                        })
                    })
                    .catch(err => {
                        app.logger.error(err, __filename)
                        res.status(500).json({ message: 'Ocorreu um erro no servidor ao atualizar a sua senha.' })
                    })
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar seu email.' })
            })

    }

    return { Get, GetDateFromHomePage, Update, Delete, Forgot }
}