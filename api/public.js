const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const { DB_PATH, DB_PORT } = require('../config.js')

router.get('/courses', (req, res) => {
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourse = new mongoose.Schema({ Name: 'string', State: 'string', Owner: 'string' })
    const courses = connection.model('Courses', schemaCourse)
    
    courses.aggregate(
        [
            { $match: { State: "Active" }},
            { $sort: { Name: 1 }},
            {
              $lookup:
                {
                  from: "users",
                  localField: "Owner",
                  foreignField: "_id",
                  as: "item"
                }
           },
           { $unwind: "$item" },
           {
             $project: {
                 "Name": 1,
                 "State": 1,
                 "Owner": "$item.Name"
             }
           }
         ]        
    ).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send({ courses: docs })
        }
    })
})

router.get('/streams', (req, res) => {
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaStream = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date' })
    const streams = connection.model('Streams', schemaStream)
    
    streams.aggregate(
        [
            { $match: { $or: [{State: "Pending"}, {State: "Active"}]}},
            { $sort: { Name: 1 }},
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
                    "State": 1,
                    "StateInfo": 1,
                    "Owner": "$itemuser.Name",
                    "Course": "$itemcourse.Name",
                    "OwnerId": "$itemuser._id",
                    "CourseId": "$itemcourse._id",
                    "Start": 1,
                    "Finish": 1
                }
            }
        ]        
    ).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send({ streams: docs })
        }
    })
})
router.get('/courses/:id', (req, res) => {
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourse = new mongoose.Schema({ Name: 'string', Description: 'string', lessons: 'array' })
    const course = connection.model('Courses', schemaCourse)

    const courseId = req.params.id
    course.aggregate(
        [
            { $match: { _id: mongoose.Types.ObjectId(courseId) }},
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
                $project: {
                    "Name": 1,
                    "State": 1,
                    "Owner": "$itemuser.Name",
                    "OwnerId": "$itemuser._id",
                    "Description": 1,
                    "Lessons": 1
                }
            },
            { $unwind: "$Lessons" },
            { $sort: { "Lessons.OrderNo": 1 }},
            { $group: {
                _id: "$_id",
                Name: { $first: "$Name" },
                State: { $first: "$State" },
                Description: { $first: "$Description" },
                OwnerId: { $first: "$OwnerId" },
                Owner: { $first: "$Owner" },
                Lessons: { $push: "$Lessons" }}
            }
        ]        
    ).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send(docs[0])
        }
    }) 
})
router.get('/streams/:id', (req, res) => {
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaStream = new mongoose.Schema({ Name: 'string', Owner: 'object', Course: 'object', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', lessons: 'array' })
    const stream = connection.model('Streams', schemaStream)

    const streamId = req.params.id
    stream.aggregate(
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
                    "State": 1,
                    "StateInfo": 1,
                    "Owner": "$itemuser.Name",
                    "OwnerId": "$itemuser._id",
                    "CourseId": "$itemcourse._id",
                    "Start": 1,
                    "Finish" : 1,
                    "Lessons": 1
                }
            },
            { $unwind: "$Lessons" },
            //{ $sort: { "Lessons.OrderNo": 1 }},
            {
                $group: {
                    _id: "$_id",
                    Name: { $first: "$Name" },
                    State: { $first: "$State" },
                    StateInfo: { $first: "$StateInfo" },
                    OwnerId: { $first: "$OwnerId" },
                    Owner: { $first: "$Owner" },
                    CourseId: { $first: "$CourseId" },
                    Start: { $first: "$Start" },
                    Finish: { $first: "$Finish" },
                    Lessons: { $push: "$Lessons" }
                }
            }
        ]        
    ).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send(docs[0])
        }
    }) 
})

module.exports = router
