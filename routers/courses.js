const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.sendStatus(200)
})
router.post('/', (req, res) => {
    res.sendStatus(200)
})
router.get('/:id/lessons', (req, res) => {
    res.sendStatus(200)
})
router.post('/:id/lessons', (req, res) => {
    res.sendStatus(200)
})
router.get('/lessons/:id', (req, res) => {
    res.sendStatus(200)
})
router.get('/lessons/:id/materials', (req, res) => {
    res.sendStatus(200)
})
router.post('/lessons/:id/materials', (req, res) => {
    res.sendStatus(200)
})
router.get('/:id/streams', (req, res) => {
    res.sendStatus(200)
})
router.post('/:id/streams', (req, res) => {
    res.sendStatus(200)
})

module.exports = router
