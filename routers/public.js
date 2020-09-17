const express = require('express')
const router = express.Router()

const controllers = require('../controllers/public.js')

router.get('/courses', (req, res) => {
    controllers.courses(req, res)
})
router.get('/courses/:id', (req, res) => {
    controllers.coursepublic(req, res)
})
router.get('/streams', (req, res) => {
    controllers.streams(req, res)
})
router.get('/streams/:id', (req, res) => {
    controllers.streampublic(req, res)
})

module.exports = router
