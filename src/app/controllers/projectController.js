const express = require("express")
const authMiddleware = require('../middlewares/auth')


const Project = require('../models/Project')
const Task = require('../models/Task')

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
    return res.send({ message: 'List ok', userID: req.userID })
})

router.get('/:projectId', async (req, res) => {
   return res.send({ message: 'Show ok', userID: req.userID })
})

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const project = await Project.create(req.body)

        return res.send({ project })
    }
    catch (error) {
        return res.status(400).send({ error: 'Falha ao criar registro' })
    }
})

router.put('/:projectId', async (req, res) => {
   return res.send({ message: 'Update ok', userID: req.userID })
})

router.delete('/:projectId', async (req, res) => {
   return res.send({ message: 'Delete ok', userID: req.userID })
})


module.exports = app => app.use('/projects', router)