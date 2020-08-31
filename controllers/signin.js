const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')

module.exports = app => {
    return (req, res) => {
        const { email, password } = req.body

        // Verifica se foi passado o email e a senha
        if (!email || toString(email?.trim()) === '') return res.status(400).json({ message: 'Você não passou o seu email.' })
        if (!password || toString(password?.trim()) === '') return res.status(400).json({ message: 'Você não passou a sua senha.' })

        // Procura no banco de dados algum usuario com o email passado
        app.db('users_table').where({ email })
            .then(user => {
                if (user.length <= 0) return res.status(400).json({ message: 'Usuário não encontrado.' }) // Se nao encontrar nenhum usuario no DB

                const hashPasswordDB = user[0].password // Pega a senha com hash do banco de dados

                bcrypt.compare(password, hashPasswordDB, (err, match) => { // Compara a senha digitada com a senha do banco de dados
                    if (err) return res.status(500).json({ message: 'Ocorreu um erro no servidor ao fazer login.' }) // Se ocorrer algum erro
                    if (!match) return res.status(400).json({ message: 'Senha inválida.' }) // Se a senha nao for igual

                    const payload = { id: user[0].id } // Cria o payload para ser passado para o banco de dados
                    delete user[0].password // Retira a senha do objeto usuario
                    res.json({
                        user: user[0],
                        token: jwt.encode(payload, app.secretKey)
                    })
                })
            })
            .catch(_ => res.status(500).json({ message: 'Ocorreu um erro no servidor ao procurar o seu e-mail.' }))
    }
}