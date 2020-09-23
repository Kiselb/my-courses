const express = require('express')
const auth = require('./auth')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('login', {})
})
router.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.password) {
            res.sendStatus(401)
        } else {
            const token = await auth.login(req.body.name, req.body.password)
            if (!!token.token) {
                res.cookie('mycoursestoken', token.token, { httpOnly: true }) //, secure: true})
                res.status(200).send({ userId: token.userId })
            } else {
                res.sendStatus(401)
            }
        }
    } catch(err) {
        res.sendStatus(401)
    }
})

module.exports = router
