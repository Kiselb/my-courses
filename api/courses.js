const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const { DB_PATH, DB_PORT } = require('../config.js')

router.get('/', (req, res) => {
    const userId =  req.mycoursesUserId
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string' })
    const courses = connection.model('courses', schemaCourses)

    courses.find({ Owner: mongoose.Types.ObjectId(userId), State: { $in: ['Draft', 'Active'] }}).sort({ Name: 1 }).exec(
        function(err, docs) {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send({courses: docs})
        }
    })
})
router.post('/', (req, res) => {
    const userId =  req.mycoursesUserId
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
    const courses = connection.model('courses', schemaCourses)

    const courseId = mongoose.Types.ObjectId()

    courses.aggregate([
        { $project: {
            _id: courseId,
            Name: req.body.name,
            State: 'Draft',
            Owner: mongoose.Types.ObjectId(userId),
            Description: req.body.description,
            Lessons: []
        }},
        { $merge: { into: 'courses', whenMatched: 'replace' }}
    ]).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send({ courseId: courseId })
        }
    })
})
router.get('/:id', (req, res) => {
    const userId =  req.mycoursesUserId
    const courseId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
    const courses = connection.model('courses', schemaCourses)

    courses.findOne({ _id: mongoose.Types.ObjectId(courseId) }, { Lessons: { $elemMatch: { $not: { $in: [null] }}}}
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
    const userId =  req.mycoursesUserId
    const courseId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
    const courses = connection.model('courses', schemaCourses)

    courses.updateOne(
        {  _id: mongoose.Types.ObjectId(courseId) },
        [{ $set: { Name: req.body.name, Description: req.body.description }}]
    ).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send({ courseId: courseId })
        }
    })
})
router.get('/:id/streams', (req, res) => {
    const courseId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string' })
    const courses = connection.model('courses', schemaCourses)
    const schemaStreams = new mongoose.Schema({ Name: 'string', Course: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date' })
    const streams = connection.model('streams', schemaStreams)
    const data = {}

    courses.aggregate(
        [
            { $match: {  _id: mongoose.Types.ObjectId(courseId) }},
        ]
    ).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            data.course = docs[0]
            streams.aggregate(
                [
                    { $match: {  Course: mongoose.Types.ObjectId(courseId) }},
                ]
            ).exec((err, docs) => {
                if (err) {
                    connection.close()
                    res.sendStatus(500)
                } else {
                    data.streams = docs
                    connection.close()
                    res.status(200).send(data)
                }
            })
        }
    })
})
router.post('/:id/streams', (req, res) => {
    const userId =  req.mycoursesUserId
    const courseId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
    const courses = connection.model('courses', schemaCourses)

    const streamId = mongoose.Types.ObjectId()
    courses.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(courseId) }},
        { $project: {
            _id: streamId,
            Name: 1,
            Owner: mongoose.Types.ObjectId(userId),
            Course: mongoose.Types.ObjectId(courseId),
            State: 'Draft',
            StateInfo: 'Проектируется',
            Start: req.body.start,
            Finish: req.body.finish,
            Lessons: {
                $map: {
                    input: '$Lessons',
                    as: 'lessons',
                    in: { OrderNo: '$$lessons.OrderNo', Theme: '$$lessons.Theme', Purpose: '$$lessons.Purpose', DueDate: null, Duration: 2, Materials: '$$lessons.Materials'} 
                }
            }
        }},
        { $merge: { into: 'streams', whenMatched: 'replace' }}
    ]).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            connection.close()
            res.status(200).send({ streamId: streamId })
        }
    })
})
router.post('/:id/lessons', (req, res) => {
    const courseId = req.params.id
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true})
    const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
    const courses = connection.model('courses', schemaCourses)

    courses.findOne({ _id: mongoose.Types.ObjectId(courseId) }).exec((err, docs) => {
        if (err) {
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
                courses.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(courseId) },
                    { $push: { Lessons: { $each: [{ OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, Materials: [] }], $position: 0 }}}
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
                courses.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(courseId) },
                    { $push: { Lessons: {OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, Materials: []}}}
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
                courses.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(courseId) },
                    { $push: { Lessons: { $each: [{OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, Materials: [] }], $position: position - 1 }}}
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
    const courseId = req.params.id
    const lessonNo = req.params.num
    const connection = mongoose.createConnection(DB_PATH, {useNewUrlParser: true, useFindAndModify: false})
    const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
    const courses = connection.model('courses', schemaCourses)

    courses.findOne({ _id: mongoose.Types.ObjectId(courseId) }).exec((err, docs) => {
        if (err) {
            connection.close()
            res.sendStatus(500)
        } else {
            if (!docs) {
                connection.close()
                res.sendStatus(404)
            } else {
                const arrayIndex = `Lessons.${lessonNo - 1}`
                courses.findOneAndUpdate({ _id: mongoose.Types.ObjectId(courseId)}, { $unset: { [arrayIndex]: 1 }}).exec((err, docs) => {
                    if (err) {
                        connection.close()
                        res.sendStatus(500)
                    } else {
                        courses.findOneAndUpdate({ _id: mongoose.Types.ObjectId(courseId) }, { $pull: { "Lessons": null }}).exec((err, docs) => {
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

module.exports = router
