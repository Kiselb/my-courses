const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.sendStatus(200)
})
router.post('/', (req, res) => {
    res.sendStatus(200)
})
router.get('/courses', (req, res) => {
    res.sendStatus(200)
})
router.get('/streams', (req, res) => {
    res.sendStatus(200)
})

module.exports = router
