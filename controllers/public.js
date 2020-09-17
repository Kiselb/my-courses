const axios = require('axios')

exports.courses = function(req, res) {
    axios.get('http://127.0.0.1:5100/public/courses')
        .then(response => res.render('activecourses', response.data))
        .catch(error => res.sendStatus(500))
}
exports.streams = function(req, res) {
    axios.get('http://127.0.0.1:5100/public/streams')
        .then(response => res.render('activestreams', response.data))
        .catch(error => res.sendStatus(500))
}
exports.coursepublic = function(req, res) {
    axios.get(`http://127.0.0.1:5100/public/courses/${req.params.id}`)
        .then(response => res.render('publiccourse', response.data))
        .catch(error => res.sendStatus(500))
}
exports.streampublic = function(req, res) {
    axios.get(`http://127.0.0.1:5100/public/streams/${req.params.id}`)
        .then(response => res.render('publicstream', response.data))
        .catch(error => res.sendStatus(500))
}
