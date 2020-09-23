const axios = require('axios')

exports.course = function(req, res) {
    axios.get(`http://127.0.0.1:5100/courses/${req.params.id}`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.render('./private/course', response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.addCourse = function(req, res) {
    axios.post(`http://127.0.0.1:5100/courses`, req.body, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => { console.log(response.data); res.status(200).send(response.data); })
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.courseStreams = function(req, res) {
    axios.get(`http://127.0.0.1:5100/courses/${req.params.id}/streams`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.render('./private/coursestreams', response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.addCourseStream = function(req, res) {
    axios.post(`http://127.0.0.1:5100/courses/${req.params.id}/streams`, req.body, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.status(200).send(response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.mycourses = function(req, res) {
    axios.get('http://127.0.0.1:5100/courses', { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.render('./private/courses', response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.addCourseLesson = function(req, res) {
    axios.post(`http://127.0.0.1:5100/courses/${req.params.id}/lessons`, req.body, { headers: { 'Content-Type': 'application/json', 'Authorization': req.mycoursestoken }})
    .then(response => res.sendStatus(200))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.remCourseLesson = function(req, res) {
    axios.delete(`http://127.0.0.1:5100/courses/${req.params.id}/lessons/${req.params.num}`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.sendStatus(200))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
