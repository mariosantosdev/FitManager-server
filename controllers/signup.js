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

    // Funcao para criar o usuario
    return (req, res) => {
        const { name, email } = req.body
        let { password } = req.body

        if (!name || toString(name.trim()) === '') return res.status(400).json({ message: 'Escolha um nome para ser cadastrado.' })
        if (!email || toString(email.trim()) === '') return res.status(400).json({ message: 'Escolha um e-mail para ser cadastrado.' })
        if (!password || toString(password.trim()) === '') return res.status(400).json({ message: 'Escolha uma senha para ser cadastrada.' })
        app.db.findOne({ email }).then(async checkUserExist => {
            if (checkUserExist) return res.status(400).json({ message: 'Este e-mail já está cadastrado.' })

            password = await GenerateHash(password)
            try {
                await new app.db({ name, email, password, created_at: new Date() }).save()
                    .then(_ => res.status(200).json({ message: 'Sua conta foi criada.' }))
            } catch (err) {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao criar sua conta.' })
            }
        })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ massage: 'Ocorreu um erro no servidor ao verificar o seu e-mail.' })
            })
    }
}