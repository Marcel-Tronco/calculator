const express = require('express')
const app = express()
const calcRouter = require('./controllers/calc')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

app.use(middleware.requestLogger)
app.use('/api/blogs', calcRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app