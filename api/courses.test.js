const axios = require('axios')
const { API_PATH } = require('../config.js')
const token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDEzMTIxNDMsImV4cCI6MjA4MTMxMjE0Mywic3ViIjoiNWY0NTE4MzVhNzIwYjc1ZWM0MDYyZWI0In0.JtLTJcU8GtFky3b2e-MoI7i3OS5G4iiACW6Dbk6OylyYJrgWtB3LMcwZHoJg67ZvMQBC5q5gxEDjteLwXQdzr2yEK-gnBO9xFFFZtBfg0MMV7FKIvyRhU6g1yotsORqqY7a-z9GIFoHnIyt-vpvcKyFSdQiCgGcCOWhkRUoQbYQ"

describe('api get private courses', () => {
    it('get private courses status', async (done) => {
        axios.get(`${API_PATH}/courses`, { headers: { 'Authorization': token }})
        .then(response => {
            expect(response.status).toBe(200)
            done()
        })
        .catch(error => done(error))
    });
    it('get private courses data', async (done) => {
        axios.get(`${API_PATH}/courses`, { headers: { 'Authorization': token }})
        .then(response => {
            expect(response.data.courses.length).toBeGreaterThan(0)
            done()
        })
        .catch(error => done(error))
    });
    it('get private courses data structure', async (done) => {
        axios.get(`${API_PATH}/courses`, { headers: { 'Authorization': token }})
        .then(response => {
            expect(response.data.courses[0]).toEqual(
                expect.objectContaining({
                    _id: expect.any(String),
                    State: expect.any(String),
                    Owner: expect.any(String),
                    Description: expect.any(String),
                    Lessons: expect.any(Array)
                })
            )
            done()
        })
        .catch(error => done(error))
    });
})
describe('api update course', () => {
    it('update course status', async (done) => {
        axios.put(`${API_PATH}/courses/5f748b243e5d5927d6c59857`, { name: "Вводный курс Data Science (TEST)", description: "description" }, { headers: { 'Authorization': token }})
        .then(response => {
            expect(response.status).toBe(200)
            done()
        })
        .catch(error => done(error))
    });
    it('update course data', async (done) => {
        const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        axios.put(`${API_PATH}/courses/5f748b243e5d5927d6c59857`, { name: "Вводный курс Data Science (TEST)", description: random }, { headers: { 'Authorization': token }})
        .then(response => {
            axios.get(`${API_PATH}/courses/5f748b243e5d5927d6c59857`, { headers: { 'Authorization': token }})
            .then(response => {
                expect(response.data.Description).toBe(random)
                done()
            })
            .catch(error => done(error))
        })
        .catch(error => done(error))
    })
})
describe('api create course', () => {
    it('create course status', async (done) => {
        axios.post(`${API_PATH}/courses`, { name: "Вводный курс Data Science (CREATE)", description: "TEST Registering new course" }, { headers: { 'Authorization': token }})
        .then(response => {
            expect(response.status).toBe(200)
            done()
        })
        .catch(error => done(error))
    });
    it('create course data', async (done) => {
        const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        axios.post(`${API_PATH}/courses`, { name: "Вводный курс Data Science (CREATE)", description: random }, { headers: { 'Authorization': token }})
        .then(response => {
            axios.get(`${API_PATH}/courses/${response.data.courseId}`, { headers: { 'Authorization': token }})
            .then(response => {
                expect(response.data.Description).toBe(random)
                done()
            })
            .catch(error => done(error))
        })
        .catch(error => done(error))
    })
})
