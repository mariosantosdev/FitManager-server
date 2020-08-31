require('dotenv').config()
const consign = require('consign')
const app = require('express')()
const db = require('./database/db')
const logger = require('./config/logger').Logger

app.use((req, res, next) => {
    app.logger = logger
    next()
})

consign()
    .then('./config/middlewares.js')
    .then('./controllers')
    .then('./config/routes.js')
    .into(app)

app.db = db
app.secretKey = process.env.SECRET_KEY

app.listen(process.env.PORT || 3000, console.log('[server] -> start success.'))
