const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('Simple requests to unexisting endpoints returns error-json', async () => {
  await api
    .get('/')
    .expect(404)
    .expect('Content-Type', /application\/json/)
})

test('Simple requests without querry returns correct error-json', async () => {
  await api
    .get('/calculus')
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('Wrong encoding returns error', async () => {
  await api
    .get(`/calculus?query=3*4`)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('Simple requests returns correct value', async () => {
  let data = Buffer.from("3*4").toString('base64')
  await api
    .get(`/calculus?query=${data}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
