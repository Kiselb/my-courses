const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const auth = require('./routers/auth')
const routersCourses = require('./routers/courses.js')
const routersStreams = require('./routers/streams.js')
const routersUsers = require('./routers/users.js')
const routersLogin = require('./routers/login.js')
const routersLogout = require('./routers/logout.js')

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.use((req, res, next) => {
    console.log(req.originalUrl)
    next()
})
app.use(['/courses', '/streams'], (req, res, next) => {
    console.log(req.originalUrl)
    if (auth.verify(req.cookies["token"])) {
        next()
    } else { 
        res.sendStatus(401)
    }
})

app.get('/', (req, res, next) => {
    res.render('index', {})
})
app.use('/courses', routersCourses)
app.use('/streams', routersStreams)
app.use('/users', routersUsers)
app.use('/login', routersLogin)
app.use('/logout', routersLogout)

app.listen(5000, () => console.log('Running on Port 5000'))
