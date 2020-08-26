const express = require('express')
const auth = require('./auth')

const router = express.Router()

router.get('/', (req, res) => {
    console.log('Render Login Page')
    res.sendStatus(200)
})
router.post('/', async (req, res) => {
    if (!req.body.name || !req.body.password) {
        res.sendStatus(401)
    } else {
        const token = await auth.login(req.body.name, req.body.password)
        if (!!token) {
            res.cookie('token', token, { httpOnly: true, secure: true})
            res.sendStatus(200)
        } else {
            res.sendStatus(401)
        }
    }
})

module.exports = router
