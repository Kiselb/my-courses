const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

exports.course = function(req, res) {
    const userId =  req.mycoursesUserId
    const courseId = req.params.id

    if (!userId) {
        res.sendStatus(401)
    } else {
        const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
        const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
        const courses = connection.model('courses', schemaCourses)

        courses.findOne({ _id: mongoose.Types.ObjectId(courseId) }, { Lessons: { $elemMatch: { $not: { $in: [null] }}}}
        // courses.aggregate(
        //     [
        //         { $match: { _id: mongoose.Types.ObjectId(courseId) }},
        //         {
        //             $project: {
        //                 "Name": 1,
        //                 "State": 1,
        //                 "Description": 1,
        //                 "Lessons": 1
        //             }
        //         },
        //         { $unwind: "$Lessons" },
        //         //{ $sort: { "Lessons.OrderNo": 1 }},
        //         { $group: {
        //             _id: "$_id",
        //             Name: { $first: "$Name" },
        //             State: { $first: "$State" },
        //             Description: { $first: "$Description" },
        //             Lessons: { $push: "$Lessons" }}
        //         }
        //     ]        
        ).exec(
            function(err, docs) {
            if (err) {
                res.sendStatus(500)
            } else {
                if (!docs) {
                    res.sendStatus(404)
                } else {
                    res.render('./private/course', docs)
                }
            }
        })
    }
}
exports.courseStreams = function(req, res) {
    const userId =  req.mycoursesUserId
    const courseId = req.params.id

    if (!userId) {
        res.sendStatus(401)
    } else {
        if (!courseId) {
            res.sendStatus(400)
        } else {
            const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
            const schemaStreams = new mongoose.Schema({ Name: 'string', Course: 'string', State: 'string', StateInfo: 'string', Start: 'date', Finish: 'date' })
            const streams = connection.model('streams', schemaStreams)

            streams.aggregate(
                [
                    { $match: {  Course: mongoose.Types.ObjectId(courseId) }},
                    {
                        $project: {
                            "Name": 1,
                            "Owner": 1,
                            "Course": 1,
                            "State": 1,
                            "StateInfo": 1,
                            "Start": 1,
                            "Finish": 1
                        }
                    },
                    {
                        $group: {
                            _id: "$Course",
                            streams: { $push: { Name: "$Name", Owner: "$Owner", State: "$State", StateInfo: "$StateInfo", Start: "$Start", Finish: "$Finish" } }
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "itemcourse"
                        }
                    },
                    { $unwind: "$itemcourse" },
                    {
                        $project: {
                            Name: "$itemcourse.Name",
                            Description: "$itemcourse.Description",
                            State: "$itemcourse.State",
                            streams: 1
                        }
                    },
                ]        
            ).exec((err, docs) => {
                if (err) {
                    res.sendStatus(500)
                } else {
                    console.log(docs[0])
                    res.render('./private/coursestreams', docs[0])
                }
            })
        }
    }
}
exports.mycourses = function(req, res) {
    const userId =  req.mycoursesUserId

    if (!userId) {
        res.sendStatus(401)
    } else {
        const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
        const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string' })
        const courses = connection.model('courses', schemaCourses)

        courses.find({ Owner: mongoose.Types.ObjectId(userId), State: { $eq: 'Active' }}).sort({ Name: 1 }).exec(
            function(err, docs) {
            if (err) {
                res.sendStatus(500)
            } else {
                res.render('./private/courses', {courses: docs})
            }
        })
    }
}
exports.addCourseLesson = function(req, res) {
    const userId =  req.mycoursesUserId

    if (!userId) {
        res.sendStatus(401)
    } else {
        const courseId = req.params.id
        if (!courseId) {
            res.sendStatus(400)
        } else {
            const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
            const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
            const courses = connection.model('courses', schemaCourses)

            courses.findOne({ _id: mongoose.Types.ObjectId(courseId) }).exec((err, docs) => {
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
                        courses.findOneAndUpdate(
                            { _id: mongoose.Types.ObjectId(courseId) },
                            { $push: { Lessons: { $each: [{ OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, Materials: [] }], $position: 0 }}}
                        ).exec((err, docs) => {
                            if (err) {
                                res.sendStatus(500)
                            } else {
                                res.sendStatus(200)
                            }
                        })
                    } else if (type < 0) {
                        courses.findOneAndUpdate(
                            { _id: mongoose.Types.ObjectId(courseId) },
                            { $push: { Lessons: {OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, Materials: []}}}
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
                        courses.findOneAndUpdate(
                            { _id: mongoose.Types.ObjectId(courseId) },
                            { $push: { Lessons: { $each: [{OrderNo: 1, Theme: req.body.theme, Purpose: req.body.purpose, Duration: 2, Materials: [] }], $position: position - 1 }}}
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
        }
    }
}
exports.remCourseLesson = function(req, res) {
    const userId =  req.mycoursesUserId
    if (!userId) {
        res.sendStatus(401)
    } else {
        const courseId = req.params.id
        const lessonNo = req.params.num
        if (typeof courseId === "undefined" || typeof lessonNo === "undefined") {
            res.sendStatus(400)
        } else {
            const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true, useFindAndModify: false})
            const schemaCourses = new mongoose.Schema({ Name: 'string', State: 'string', Description: 'string', Lessons: 'array' })
            const courses = connection.model('courses', schemaCourses)

            courses.findOne({ _id: mongoose.Types.ObjectId(courseId) }).exec((err, docs) => {
                if (err) {
                    res.sendStatus(500)
                } else {
                    if (!docs) {
                        res.sendStatus(404)
                    } else {
                        const arrayIndex = `Lessons.${lessonNo - 1}`
                        courses.findOneAndUpdate({ _id: mongoose.Types.ObjectId(courseId)}, { $unset: { [arrayIndex]: 1 }}).exec((err, docs) => {
                            if (err) {
                                res.sendStatus(500)
                            } else {
                                courses.findOneAndUpdate({ _id: mongoose.Types.ObjectId(courseId) }, { $pull: { "Lessons": null }}).exec((err, docs) => {
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
        }
    }
}
