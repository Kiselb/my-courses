const express = require('express')
const router = express.Router()

const controllers = require('../controllers/streams.js')

router.get('/:id/subscribeinfo', (req, res) => {
    controllers.subscribeOnStreamInfo(req, res)
})
router.get('/:id/subscribewarning', (req, res) => {
    controllers.subscribeOnStreamWarning(req, res)
})
router.get('/', (req, res) => {
    controllers.mystreams(req, res)
})
router.post('/', (req, res) => {
    res.sendStatus(200)
})
router.get('/:id', (req, res) => {
    controllers.stream(req, res)
})
router.delete('/:id', (req, res) => {
    controllers.remStream(req, res)
})
router.get('/:id/students', (req, res) => {
    controllers.students(req, res)
})
router.post('/:id/students', (req, res) => {
    controllers.subscribeOnStream(req, res)
})
router.get('/:id/lessons', (req, res) => {
    controllers.stream(req, res)
})
router.post('/:id/lessons', (req, res) => {
    controllers.addStreamLesson(req, res)
})
router.delete('/:id/lessons/:num', (req, res) => {
    controllers.remStreamLesson(req, res)
})
router.get('/:id/lessons/:num/materials', (req, res) => {
    res.sendStatus(200)
})
router.post('/:id/lessons/:num/materials', (req, res) => {
    res.sendStatus(200)
})
router.get('/:id/lessons/:num/comments', (req, res) => {
    res.sendStatus(200)
})
router.post('/:id/lessons/:num/comments', (req, res) => {
    res.sendStatus(200)    
})

module.exports = router
