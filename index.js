const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

const routesCourses = require('./routers/courses.js')
const routesStreams = require('./routers/streams.js')
const routesUsers = require('./routers/users.js')

const app = express()

app.use(express.static(path.join(__dirname, '/')))
app.use(bodyParser.json())
app.use(cors())

app.use('/courses', routesCourses)
app.use('/streams', routesStreams)
app.use('/users', routesUsers)

app.listen(5000, () => console.log('Running on Port 5000'))
