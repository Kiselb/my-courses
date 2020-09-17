const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

router.get('/', (req, res) => {
    const userId = req.mycoursesUserId
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', { useNewUrlParser: true })
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Course: 'object', Start: 'date', Finish: 'date' })
    const streams = connection.model('streams', schemaStreams)

    streams.find({ Owner: mongoose.Types.ObjectId(userId), State: { $in: ['Draft', 'Active', 'Pending'] }}).sort({ Name: 1 }).exec(
        function(err, docs) {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).send({ streams: docs })
        }
    })
})
router.get('/:id', (req, res) => {
    const streamId = req.params.id
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', Lessons: 'array' })
    const streams = connection.model('streams', schemaStreams)

    streams.findOne({ _id: mongoose.Types.ObjectId(streamId) }, { Lessons: { $elemMatch: { $not: { $in: [null] }}}}
    ).exec(
        function(err, docs) {
        if (err) {
            res.sendStatus(500)
        } else {
            if (!docs) {
                res.sendStatus(404)
            } else {
                res.status(200).send(docs)
            }
        }
    })
})
router.post('/:id/lessons', (req, res) => {
    const streamId = req.params.id
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', Lessons: 'array' })
    const streams = connection.model('streams', schemaStreams)

    streams.findOne({ _id: mongoose.Types.ObjectId(streamId) }).exec((err, docs) => {
        if (err) {
            res.sendStatus(500)
        } else {
            if (!docs) {
                res.sendStatus(404)
                return
            }
            if (typeof req.body.type === "undefined") {
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
                        res.sendStatus(500)
                    } else {
                        res.sendStatus(200)
                    }
                })
            } else if (type < 0) {
                streams.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(streamId) },
                    { $push: { Lessons: {OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, DueDate: req.body.dueDate, Materials: []}}}
                ).exec((err, docs) => {
                    if (err) {
                        res.sendStatus(500)
                    } else {
                        res.sendStatus(200)
                    }
                })
            } else if (type > 0) {
                if (typeof req.body.position === "undefined") {
                    sendStatus(400)
                    return
                }
                const position = +req.body.position
                streams.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(streamId) },
                    { $push: { Lessons: { $each: [{OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, DueDate: req.body.dueDate, Materials: [] }], $position: position - 1 }}}
                ).exec((err, docs) => {
                    if (err) {
                        res.sendStatus(500)
                    } else {
                        res.sendStatus(200)
                    }
                })
            } else {
                res.sendStatus(400)
            }
        }
    })
})
router.delete('/:id/lessons/:num', (req, res) => {
    const streamId = req.params.id
    const lessonNo = req.params.num
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
    const schemaStreams = new mongoose.Schema({ Name: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date', Lessons: 'array' })
    const streams = connection.model('streams', schemaStreams)

    streams.findOne({ _id: mongoose.Types.ObjectId(streamId) }).exec((err, docs) => {
        if (err) {
            res.sendStatus(500)
        } else {
            if (!docs) {
                res.sendStatus(404)
            } else {
                const arrayIndex = `Lessons.${lessonNo - 1}`
                streams.findOneAndUpdate({ _id: mongoose.Types.ObjectId(streamId)}, { $unset: { [arrayIndex]: 1 }}).exec((err, docs) => {
                    if (err) {
                        res.sendStatus(500)
                    } else {
                        streams.findOneAndUpdate({ _id: mongoose.Types.ObjectId(streamId) }, { $pull: { "Lessons": null }}).exec((err, docs) => {
                            if (err) {
                                res.sendStatus(500)
                            } else {
                                res.sendStatus(204)
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
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
    const schemaUsers = new mongoose.Schema({ Name: 'string', EMail: 'string', streams: 'array' })
    const users = connection.model('users', schemaUsers)

    users.aggregate(
        [
            { $match: { streams: { $elemMatch: { $eq: mongoose.Types.ObjectId(streamId) }}}},
            {
                $project: {
                    "streams": 1,
                    "Name": 1,
                    "EMail": 1
                }
            },
            {
                $group: {
                    _id: "$streams",
                    students: { $push: { Name: "$Name", EMail: "$EMail" } }
                }
            },
            { $unwind: "$_id"},
            {
                $lookup:
                {
                    from: "streams",
                    localField: "_id",
                    foreignField: "_id",
                    as: "itemstream"
                }
            },
            { $unwind: "$itemstream" },
            {
                $project: {
                    Name: "$itemstream.Name",
                    State: "$itemstream.State",
                    StateInfo: "$itemstream.StateInfo",
                    Course: "$itemstream.Course",
                    Start: "$itemstream.Start",
                    Finish: "$itemstream.Finish",
                    students: 1
                }
            }
        ]        
    ).exec((err, docs) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).send(docs[0])
        }
    })
})
router.post('/:id/students', (req, res) => {
    const userId =  req.mycoursesUserId
    const streamId = req.params.id
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
                // findOneAndUpdate --> findAndModify --> update
                users.update({ _id: mongoose.Types.ObjectId(userId)}, { $push: { 'streams': mongoose.Types.ObjectId(streamId) }}).exec((err, docs) => {
                    if (err) {
                        res.sendStatus(500)
                    } else {
                        res.sendStatus(200)
                    }
                })
            }
        }
    })
})
router.get('/:id/subscribeinfo', (req, res) => {
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
                res.status(200).send({ ... docs[0] })
            }
        }
    })    
})
router.get('/:id/subscribewarning', (req, res) => {
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
                res.status(200).send({ ... docs[0] })
            }
        }
    })    
})

module.exports = router
