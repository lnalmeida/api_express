const express = require("express")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth.json')

const User = require('../models/User')

const router = express.Router()

function generateTokens(params = {}) {
    return jwt.sign(params, authConfig.secret, {
            expiresIn: 86400,
        })
}

router.post('/register', async (req, res) => {
    const { email } = req.body
    try {
        if(await User.findOne({ email })) 
            return res.status(400).send({ error: 'Usuário já cadastrado!'})

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({ user, token : generateTokens({ id : user.id })})
    }
    catch(error) {
        res.status(400).send({ error: 'Falha no registro!' })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user)
            return res.status(400).send({ error: 'Usuário não encontrado!' })

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Senha inválida!' })

        user.password = undefined

        return res.send({ user, token : generateTokens({ id: user.id })})
    }
    catch (error) {
        res.status(400).send({ error: 'Falha no ligin!' })
    }
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if(!user) {
            return res.status(400).send({ error: 'Usuário não encontrado' })
        }
        const token = crypto.randomBytes(20).toString('hex')
        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user._id, {
            $set:{
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        })
        
        mailer.sendMail({
            to: email,
            from: 'l.n.almeida.ti@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Falha ao enviar email de recuperação de senha.' })
            
            return res.send({ message: 'email enviado com sucesso!' })
        })
   }
   catch (error) {
       return res.status(400).send({ error: 'Falha ao lembrar senha. Tente novamente.' })
   }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body
    
    try{
        const user = await User.findOne({ email })
                            .select('+passwordResetToken passwordResetExpires')

        if(!user)
           return res.status(400).send({ error: 'Usuário não encontrado!' })
        
        if(token !== user.passwordResetToken)
           return res.status(400).send({ error: 'Token de recuperação inválido!' })

        const now = new Date()

        if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token de recuperação expirado. Refaça o procedimento' })

        user.password = password

        await user.save()

        return res.send({ message: 'Senha alterada com sucesso!'})


    }
    catch (error) {
        return res.status(400).send({ error: 'Falha ao resterar a senha.' })
    }
})

module.exports = app => app.use('/auth', router)