const express = require('express')
//
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

require('./app/controllers/index')(app)

app.listen(port, () => console.log(`Servidor OnLine na porta ${port}`))