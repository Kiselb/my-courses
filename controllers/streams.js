const express = require('express')
const mongoose = require('mongoose')

exports.subscribeOnStream = function(req, res) {
    const userId =  req.mycoursesUserId
    const streamId = req.params.id

    console.log("UserId: ", userId)
    if (!userId || !streamId) {
        res.sendStatus(401)
    } else {
        const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
        const schemaUser = new mongoose.Schema({ Name: 'string', streams: 'array' })
        const users = connection.model('Users', schemaUser)

        users.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId)}, { $push: { 'streams': mongoose.Types.ObjectId(streamId) }}).exec((err, docs) => {
            if (err) {
                err.sendStatus(500)
            } else {
                console.log(docs.Name, docs.streams)
                res.sendStatus(200)
            }
        })
    }
}
