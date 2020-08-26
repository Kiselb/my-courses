const express = require('express')
const auth = require('./auth')

const router = express.Router()

router.post('/', (req, res) => {
    console.log('Render Login Page')
    res.clearCookie('token', { httpOnly: true, secure: true})
    res.sendStatus(200)
})

module.exports = router
