const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')

module.exports = app => {
    return (req, res) => {
        const { email, password } = req.body

        // Verifica se foi passado o email e a senha
        if (!email || toString(email.trim()) === '') return res.status(400).json({ message: 'Você não passou o seu email.' })
        if (!password || toString(password.trim()) === '') return res.status(400).json({ message: 'Você não passou a sua senha.' })

        // Procura no banco de dados algum usuario com o email passado
        app.db.findOne({ email })
            .then(user => {
                if (!user) return res.status(400).json({ message: 'E-mail não cadastrado.' })

                const hashPasswordDB = user.password

                bcrypt.compare(password, hashPasswordDB, (err, match) => {
                    if (err) return res.status(500).json({ message: 'Ocorreu um erro no servidor ao fazer login.' })
                    if (!match) return res.status(400).json({ message: 'Senha inválida.' })

                    const payload = { email: user.email }
                    res.status(200).json({
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            created_at: user.created_at,
                            exercise: user.exercise
                        },
                        token: jwt.encode(payload, app.secretKey)
                    })
                })
            })
            .catch(err => {
                app.logger.error(err, __filename)
                res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar o seu e-mail.' })
            })
    }
}