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

        users.findOne({ _id: mongoose.Types.ObjectId(userId), "streams": mongoose.Types.ObjectId(streamId) }).exec((err, docs) => { // 
            if (err) {
                res.sendStatus(500)
            } else {
                if (docs) {
                    res.sendStatus(302)
                } else {
                    users.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId)}, { $push: { 'streams': mongoose.Types.ObjectId(streamId) }}).exec((err, docs) => {
                        if (err) {
                            res.sendStatus(500)
                        } else {
                            res.sendStatus(200)
                        }
                    })
                }
            }
        })
    }
}
exports.subscribeOnStreamInfo = function(req, res) {
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
    const schemaStream = new mongoose.Schema({ Name: 'string', Owner: 'string', OwnerId: 'object', CourseId: 'object', Start: 'date', Finish: 'date' })
    const streams = connection.model('streams', schemaStream)
    const streamId = req.params.id

    streams.aggregate(
        [
            { $match: { _id: mongoose.Types.ObjectId(streamId) }},
            {
              $lookup:
                {
                  from: "users",
                  localField: "Owner",
                  foreignField: "_id",
                  as: "itemuser"
                }
            },
            { $unwind: "$itemuser" },
            {
                $lookup:
                {
                    from: "courses",
                    localField: "Course",
                    foreignField: "_id",
                    as: "itemcourse"
                }
            },
            { $unwind: "$itemcourse" },
            {
                $project: {
                    "Name": 1,
                    "Owner": "$itemuser.Name",
                    "OwnerId": "$itemuser._id",
                    "CourseId": "$itemcourse._id",
                    "Start": 1,
                    "Finish": 1
                }
            }
        ]        
    ).exec((err, docs) => {
        if (err) {
            res.sendStatus(500)
        } else {
            if (docs.length === 0) {
                res.sendStatus(404)
            } else {
                res.render("subscribecourse", { ... docs[0] })
            }
        }
    })    
}
exports.subscribeOnStreamWarning = function(req, res) {
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
    const schemaStream = new mongoose.Schema({ Name: 'string', Owner: 'string', OwnerId: 'object', CourseId: 'object', Start: 'date', Finish: 'date' })
    const streams = connection.model('streams', schemaStream)
    const streamId = req.params.id

    streams.aggregate(
        [
            { $match: { _id: mongoose.Types.ObjectId(streamId) }},
            {
              $lookup:
                {
                  from: "users",
                  localField: "Owner",
                  foreignField: "_id",
                  as: "itemuser"
                }
            },
            { $unwind: "$itemuser" },
            {
                $lookup:
                {
                    from: "courses",
                    localField: "Course",
                    foreignField: "_id",
                    as: "itemcourse"
                }
            },
            { $unwind: "$itemcourse" },
            {
                $project: {
                    "Name": 1,
                    "Owner": "$itemuser.Name",
                    "OwnerId": "$itemuser._id",
                    "CourseId": "$itemcourse._id",
                    "Start": 1,
                    "Finish": 1
                }
            }
        ]        
    ).exec((err, docs) => {
        if (err) {
            res.sendStatus(500)
        } else {
            if (docs.length === 0) {
                res.sendStatus(404)
            } else {
                res.render("subscribecoursewarning", { ... docs[0] })
            }
        }
    })    
}
