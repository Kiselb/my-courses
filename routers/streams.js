const express = require('express')
const router = express.Router()

const controllers = require('../controllers/streams.js')

router.get('/active', (req, res) => {
    res.sendStatus(200)
})
router.get('/archive', (req, res) => {
    res.sendStatus(200)
})
router.get('/:id/lessons', (req, res) => {
    res.sendStatus(200)
})
router.post('/:id/lessons', (req, res) => {
    res.sendStatus(200)
})
router.get('/:id/students', (req, res) => {
    res.sendStatus(200)
})
router.post('/:id/students', (req, res) => {
    //res.sendStatus(200)
    controllers.subscribeOnStream(req, res)
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
router.get('/lessons/:id/comments', (req, res) => {
    res.sendStatus(200)
})
router.post('/lessons/:id/comments', (req, res) => {
    res.sendStatus(200)    
})

module.exports = router
