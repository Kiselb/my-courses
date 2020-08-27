const express = require('express')
const auth = require('./auth')

const router = express.Router()

router.post('/', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true})
    //res.render('index', {})
    res.sendStatus(200)
})

module.exports = router
