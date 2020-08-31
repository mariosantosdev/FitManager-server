const bcrypt = require('bcryptjs')
const moment = require('moment')
moment.locale('pt-br')

module.exports = app => {
    // Funcao para gerar uma hash da senha
    const GenerateHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return new Error(err)
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) return new Error(err)
                callback(hash)
            })
        })
    }

    // Funcao para criar o usuario
    return (req, res) => {
        const { name, email, password } = req.body

        if (!name || toString(name.trim()) === '') return res.status(400).json({message: 'Escolha um nome para ser cadastrado.'})
        if (!email || toString(email.trim()) === '') return res.status(400).json({message: 'Escolha um e-mail para ser cadastrado.'})
        if (!password || toString(password.trim()) === '') return res.status(400).json({message: 'Escolha uma senha para ser cadastrada.'})
        app.db('users_table').where({ email }) // Verifica se ja existe um usuario com esse email
            .then(user => {
                if (user[0]) return res.status(400).json({ message: 'Esta e-mail já está cadastrado.' }) // Se ja existir o email retornar um erro

                // Chama a funcao para gerar a hash da senha
                GenerateHash(password, async (hashPassword) => {
                    const trx = await app.db.transaction() // modulo para fazer transações seguras no banco de dados

                    try {
                        await trx('users_table').insert({
                            name,
                            email,
                            password: hashPassword,
                            created_at: new Date()
                        })

                        trx.commit()
                        res.status(200).json({ message: 'Sua conta foi criada.' })
                    } catch (error) {
                        res.status(500).json({ message: 'Ocorreu um erro no servidor ao criar sua conta.' })
                    }
                })
            })
            .catch(_ => res.status(500).json({ massage: 'Ocorreu um erro no servidor ao verificar o seu e-mail.' }))
    }
}