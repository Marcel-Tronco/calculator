const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: true, message: 'unknown endpoint' })
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, _request, response, _next) => {
  logger.error(`${new Date().toLocaleString()}: ${error.message}`)
  if (
    error.name === 'InputError'
    || error.name === 'DevisionByZeroError'
    || error.name === 'DecodingError'
  ) {
    return response.status(400).send({
      error: true,
      message: error.message
    })
  }
  else {
    logger.error(error)
    return response.status(500).send({
      error: true,
      message: 'Internal Server Error'
    })
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}