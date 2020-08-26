const express = require('express')
const mongoose = require('mongoose')
const auth = require('./auth')

const router = express.Router()

router.get('/', (req, res) => {
    console.log(req.cookies)
    if (auth.verify(req.cookies["token"])) {
        //await mongoose.connect('mongodb://localhost/mycourses', {useNewUrlParser: true})
        const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
        const schemaUser = new mongoose.Schema({Name: 'string', EMail: 'string', Password: 'string'})
        const users = connection.model('Users', schemaUser)
        
        users.find({}).select({ Name: 1, EMail: 1 }).exec((err, docs) => {
            if (err) {
                res.sendStatus(500)
            } else {
                res.status(200).send(docs.map(doc => ({ Name: doc.Name, EMail: doc.EMail })));
            }
        })
    } else { 
        res.sendStatus(401)
    }
})
router.post('/', (req, res) => {
    res.sendStatus(200)
})
router.get('/courses', (req, res) => {
    res.sendStatus(200)
})
router.get('/streams', (req, res) => {
    res.sendStatus(200)
})

module.exports = router
