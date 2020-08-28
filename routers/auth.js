const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const RSA_KEYS = require('./rsakeys.js')

exports.verify = (token) => {
    if (!!token) {
        const user = jwt.verify(token, RSA_KEYS.RSA_PUBLIC_KEY).sub
        if (!!user) return user
    }
    return null
}
exports.login = async (name, password) => {
    //await mongoose.connect('mongodb://localhost/mycourses', {useNewUrlParser: true})
    const connection = mongoose.createConnection('mongodb://localhost/mycourses', {useNewUrlParser: true})
    const schemaUser = new mongoose.Schema({Name: 'string', EMail: 'string', Password: 'string'})
    const users = connection.model('Users', schemaUser)
    const userId = await users.findOne({ $and: [{Name: name}, {Password: password}]}).select({ _id: 1}).exec()
    if (!!userId) {
        const token =  jwt.sign({}, RSA_KEYS.RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: 480000000,
            subject: '' + userId._id
        })
        return token
    }
    return null
}