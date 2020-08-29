const express = require('express')
const router = express.Router()

router.get('/courses', (req, res) => {
    //res.sendStatus(200)
    res.render('index', {})
})
router.get('/streams', (req, res) => {
    //res.sendStatus(200)
    res.render('index', {})
})

module.exports = router
