const express = require('express')
const mongoose = require('mongoose')

exports.courses = function(req, res) {
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
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
            res.sendStatus(500)
        } else {
            console.dir(docs)
            res.render('activecourses', { courses: docs })
        }
    })
}

exports.streams = function(req, res) {
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
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
            res.sendStatus(500)
        } else {
            res.render('activestreams', { streams: docs })
        }
    })
}
exports.coursepublic = function(req, res) {
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
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
            res.sendStatus(500)
        } else {
            console.dir(docs[0])
            res.render('coursepublic', docs[0])
        }
    }) 
}
