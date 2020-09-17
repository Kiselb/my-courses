const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const auth = require('./routers/auth')
const public = require('./api/public')
const courses = require('./api/courses')
const streams = require('./api/streams.js')
//const users = require('./api/users.js')

const app = express()

app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, 'api')));

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.use(['/courses', '/streams'], (req, res, next) => {
    const userId = auth.verify(req.header('Authorization'))
    if (!!userId) {
        req.mycoursesUserId = userId
        next()
    } else {
        res.sendStatus(401)
    }
})

app.use('/public', public)
app.use('/courses', courses)
app.use('/streams', streams)
// app.use('/users', users)

app.listen(5100, () => console.log('API Running on Port 5100'))
