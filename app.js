const express = require('express')
const app = express()
const calcRouter = require('./controllers/calc')
const middleware = require('./utils/middleware')

app.use(middleware.requestLogger)
app.use('/calculus', calcRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app