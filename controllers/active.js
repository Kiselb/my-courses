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
            console.dir(docs)
            //res.status(200).send(docs) //.map(doc => ({ Name: doc.Name, State: doc.State, Owner: doc.Owner })));
            res.render('activestreams', { streams: docs })
        }
    })
}
