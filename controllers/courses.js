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

        //courses.findOne({ _id: mongoose.Types.ObjectId(courseId) }
        courses.aggregate(
            [
                { $match: { _id: mongoose.Types.ObjectId(courseId) }},
                {
                    $project: {
                        "Name": 1,
                        "State": 1,
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
                    Lessons: { $push: "$Lessons" }}
                }
            ]        
        ).exec(
            function(err, docs) {
            if (err) {
                res.sendStatus(500)
            } else {
                console.log(docs)
                if (!docs[0]) {
                    res.sendStatus(404)
                } else {
                    res.render('./private/course', docs[0])
                }
            }
        })
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
                console.log(docs)
                res.render('./private/courses', {courses: docs})
            }
        })
    }
}
