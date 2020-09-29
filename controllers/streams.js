const axios = require('axios')

const { API_PATH } = require('../config.js')

exports.subscribeOnStream = function(req, res) {
    axios.post(`${API_PATH}/streams/${req.params.id}/students`, req.body, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.sendStatus(response.status))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : ((error.response.status === 302)? 302: 500)))
}
exports.subscribeOnStreamInfo = function(req, res) {
    axios.get(`${API_PATH}/streams/${req.params.id}/subscribeinfo`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.render("subscribecourse", response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.subscribeOnStreamWarning = function(req, res) {
    axios.get(`${API_PATH}/streams/${req.params.id}/subscribewarning`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.render("subscribecoursewarning", response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.mystreams = function(req, res) {
    axios.get(`${API_PATH}/streams`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.render('./private/streams', response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.stream = function(req, res) {
    axios.get(`${API_PATH}/streams/${req.params.id}`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.render('./private/stream', response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.updateStream = function(req, res) {
    axios.put(`${API_PATH}/streams/${req.params.id}`, req.body, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.status(200).send(response.data))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.remStream = function(req, res) {
    axios.delete(`${API_PATH}/streams/${req.params.id}`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.sendStatus(200))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.addStreamLesson = function(req, res) {
    axios.post(`${API_PATH}/streams/${req.params.id}/lessons`, req.body, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.sendStatus(200))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.remStreamLesson = function(req, res) {
    axios.delete(`${API_PATH}/streams/${req.params.id}/lessons/${req.params.num}`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => res.sendStatus(200))
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
exports.students = function(req, res) {
    axios.get(`${API_PATH}/streams/${req.params.id}/students`, { headers: { 'Authorization': req.mycoursestoken }})
    .then(response => { console.log(response.data); res.render('./private/streamstudents', response.data); })
    .catch(error => res.sendStatus((error.response.status === 401)? 401 : 500))
}
