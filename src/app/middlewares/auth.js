const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader)
        return res.status(401).send({ error: 'Token não enviado' })

    const parts = authHeader.split(' ')

    if(!parts === 2) {
        return res.status(401).send({ error: 'Erro no token' })
    }

    const [ scheme, token ] = parts

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Token malfomado' })
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Token inválido!' })
        }

        req.userID = decoded.id
        return next()
    })
}