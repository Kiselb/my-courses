const express = require('express')
const router = express.Router()

const controllers = require('../controllers/active.js')

router.get('/courses', (req, res) => {
    controllers.courses(req, res)
})
router.get('/courses/:id', (req, res) => {
    controllers.coursepublic(req, res)
})
router.get('/streams', (req, res) => {
    controllers.streams(req, res)
})
router.post('/streams/:id', (req, res) => {
    controllers.subscribe(req, res)
})

module.exports = router
