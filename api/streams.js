const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const { DB_PATH, DB_PORT } = require('../config.js')

router.get('/', (req, res) => {
    const userId = req.mycoursesUserId
    const connection = mongoose.createConnection(DB_PATH, { useNewUrlParser: true })
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Course: 'object', Start: 'date', Finish: 'date' })
    const streams = connection.model('streams', schemaStreams)

    streams.find({ Owner: mongoose.Types.ObjectId(userId), State: { $in: ['Draft', 'Active', 'Pending'] }}).sort({ Name: 1 }).exec(
        function(err, docs) {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send({ streams: docs })
        }
    })
})
router.get('/:id', (req, res) => {
    const streamId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', Lessons: 'array' })
    const streams = connection.model('streams', schemaStreams)

    streams.findOne({ _id: mongoose.Types.ObjectId(streamId) }, { Lessons: { $elemMatch: { $not: { $in: [null] }}}}
    ).exec(
        function(err, docs) {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            if (!docs) {
                connection.close()
                res.sendStatus(404)
            } else {
                connection.close()
                res.status(200).send(docs)
            }
        }
    })
})
router.put('/:id', (req, res) => {
    const streamId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', Lessons: 'array' })
    const streams = connection.model('streams', schemaStreams)

    streams.updateOne(
        { _id: mongoose.Types.ObjectId(streamId) },
        [{ $set: { Start: req.body.start, Finish: req.body.finish }}] //Name: req.body.name, 
    ).exec(
        function(err, docs) {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            if (!docs) {
                connection.close()
                res.sendStatus(404)
            } else {
                connection.close()
                res.status(200).send({ streamId: streamId })
            }
        }
    })
})
router.delete('/:id', (req, res) => {
    const streamId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', Lessons: 'array' })
    const streams = connection.model('streams', schemaStreams)

    streams.deleteOne({ _id: mongoose.Types.ObjectId(streamId) }).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.sendStatus(200)
        }
    })
})
router.post('/:id/lessons', (req, res) => {
    const streamId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', Lessons: 'array' })
    const streams = connection.model('streams', schemaStreams)

    streams.findOne({ _id: mongoose.Types.ObjectId(streamId) }).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            if (!docs) {
                connection.close()
                res.sendStatus(404)
                return
            }
            if (typeof req.body.type === "undefined") {
                connection.close()
                res.sendStatus(400)
                return
            }
            const type = +req.body.type;
            if (type === 0) {
                streams.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(streamId) },
                    { $push: { Lessons: { $each: [{ OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, DueDate: req.body.dueDate, Materials: [] }], $position: 0 }}}
                ).exec((err, docs) => {
                    if (err) {
                        connection.close()
                        res.sendStatus(500)
                    } else {
                        connection.close()
                        res.sendStatus(200)
                    }
                })
            } else if (type < 0) {
                streams.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(streamId) },
                    { $push: { Lessons: {OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, DueDate: req.body.dueDate, Materials: []}}}
                ).exec((err, docs) => {
                    if (err) {
                        connection.close()
                        res.sendStatus(500)
                    } else {
                        connection.close()
                        res.sendStatus(200)
                    }
                })
            } else if (type > 0) {
                if (typeof req.body.position === "undefined") {
                    connection.close()
                    sendStatus(400)
                    return
                }
                const position = +req.body.position
                streams.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(streamId) },
                    { $push: { Lessons: { $each: [{OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, DueDate: req.body.dueDate, Materials: [] }], $position: position - 1 }}}
                ).exec((err, docs) => {
                    if (err) {
                        connection.close()
                        res.sendStatus(500)
                    } else {
                        connection.close()
                        res.sendStatus(200)
                    }
                })
            } else {
                connection.close()
                res.sendStatus(400)
            }
        }
    })
})
router.delete('/:id/lessons/:num', (req, res) => {
    const streamId = req.params.id
    const lessonNo = req.params.num
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', Lessons: 'array' })
    const streams = connection.model('streams', schemaStreams)

    streams.findOne({ _id: mongoose.Types.ObjectId(streamId) }).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            if (!docs) {
                connection.close()
                res.sendStatus(404)
            } else {
                const arrayIndex = `Lessons.${lessonNo - 1}`
                streams.findOneAndUpdate({ _id: mongoose.Types.ObjectId(streamId)}, { $unset: { [arrayIndex]: 1 }}).exec((err, docs) => {
                    if (err) {
                        connection.close()
                        res.sendStatus(500)
                    } else {
                        streams.findOneAndUpdate({ _id: mongoose.Types.ObjectId(streamId) }, { $pull: { "Lessons": null }}).exec((err, docs) => {
                            if (err) {
                                connection.close()
                                res.sendStatus(500)
                            } else {
                                connection.close()
                                res.sendStatus(200)
                            }
                        })
                    }
                })
            }
        }
    })
})
router.get('/:id/students', (req, res) => {
    const streamId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date' })
    const streams = connection.model('streams', schemaStreams)
    const data = {}

    streams.aggregate(
        [
            { $match: { _id: mongoose.Types.ObjectId(streamId) }},
        ]        
    ).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            data.stream = docs[0]
            const schemaUsers = new mongoose.Schema({ Name: 'string', EMail: 'string'})
            const users = connection.model('users', schemaUsers)
            users.aggregate(
                [
                    { $match: { streams: { $elemMatch: { $eq: mongoose.Types.ObjectId(streamId) }}}},
                ]
            ).exec((err, docs) => {
                if (err) {
                    connection.close()
                    res.sendStatus(500)
                } else {
                    data.users = docs
                    connection.close()
                    res.status(200).send(data)
                }
            })
        }
    })
})
router.post('/:id/students', (req, res) => {
    const userId =  req.mycoursesUserId
    const streamId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaUser = new mongoose.Schema({ Name: 'string', streams: 'array' })
    const users = connection.model('Users', schemaUser)

    users.findOne({ _id: mongoose.Types.ObjectId(userId), "streams": mongoose.Types.ObjectId(streamId) }).exec((err, docs) => { // 
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            if (docs) {
                connection.close()
                res.sendStatus(302)
            } else {
                // findOneAndUpdate --> findAndModify --> update
                users.update({ _id: mongoose.Types.ObjectId(userId)}, { $push: { 'streams': mongoose.Types.ObjectId(streamId) }}).exec((err, docs) => {
                    if (err) {
                        connection.close()
                        res.sendStatus(500)
                    } else {
                        connection.close()
                        res.sendStatus(200)
                    }
                })
            }
        }
    })
})
router.get('/:id/subscribeinfo', (req, res) => {
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
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
            connection.close()
            res.sendStatus(500)
        } else {
            if (docs.length === 0) {
                connection.close()
                res.sendStatus(404)
            } else {
                connection.close()
                res.status(200).send({ ... docs[0] })
            }
        }
    })    
})
router.get('/:id/subscribewarning', (req, res) => {
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
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
            connection.close()
            res.sendStatus(500)
        } else {
            if (docs.length === 0) {
                connection.close()
                res.sendStatus(404)
            } else {
                connection.close()
                res.status(200).send({ ... docs[0] })
            }
        }
    })    
})

module.exports = router
