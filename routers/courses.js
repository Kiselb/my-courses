const express = require('express')
const router = express.Router()

const controllers = require('../controllers/courses')

router.get('/', (req, res) => {
    controllers.mycourses(req, res)
})
router.post('/', (req, res) => {
    controllers.addCourse(req, res)
})
router.get('/:id', (req, res) => {
    controllers.course(req, res)
})
router.get('/:id/lessons', (req, res) => {
    controllers.course(req, res)
})
router.post('/:id/lessons', (req, res) => {
    controllers.addCourseLesson(req, res)
})
router.delete('/:id/lessons/:num', (req, res) => {
    controllers.remCourseLesson(req, res)
})
router.get('/:id/lessons/:num', (req, res) => {
    res.sendStatus(200)
})
router.get('/:id/lessons/:num/materials', (req, res) => {
    res.sendStatus(200)
})
router.post('/:id/lessons/:num/materials', (req, res) => {
    res.sendStatus(200)
})
router.get('/:id/streams', (req, res) => {
    controllers.courseStreams(req, res)
})
router.post('/:id/streams', (req, res) => {
   controllers.addCourseStream(req, res)
})

module.exports = router
