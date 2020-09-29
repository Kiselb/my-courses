const axios = require('axios')

const { API_PATH } = require('../config.js')

exports.courses = function(req, res) {
    axios.get(`${API_PATH}/public/courses`)
        .then(response => res.render('activecourses', response.data))
        .catch(error => res.sendStatus(500))
}
exports.streams = function(req, res) {
    axios.get(`${API_PATH}/public/streams`)
        .then(response => res.render('activestreams', response.data))
        .catch(error => res.sendStatus(500))
}
exports.coursepublic = function(req, res) {
    axios.get(`${API_PATH}/public/courses/${req.params.id}`)
        .then(response => res.render('publiccourse', response.data))
        .catch(error => res.sendStatus(500))
}
exports.streampublic = function(req, res) {
    axios.get(`${API_PATH}/public/streams/${req.params.id}`)
        .then(response => res.render('publicstream', response.data))
        .catch(error => res.sendStatus(500))
}
