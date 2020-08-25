const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

const routersCourses = require('./routers/courses.js')
const routersStreams = require('./routers/streams.js')
const routersUsers = require('./routers/users.js')

const app = express()

app.use(express.static(path.join(__dirname, '/')))
app.use(bodyParser.json())
app.use(cors())

app.use('/courses', routersCourses)
app.use('/streams', routersStreams)
app.use('/users', routersUsers)

app.listen(5000, () => console.log('Running on Port 5000'))
