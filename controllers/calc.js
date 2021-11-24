const calcRouter = require('express').Router()
const { parser } = require('../utils/parser')
const preprocess = require('../utils/preprocess')
const { InputError, DecodingError } = require('../utils/errors')

const decode = (rawParam) => {
  try {
    let text = Buffer.from(rawParam, 'base64').toString('utf-8')
    return text
  } catch (error) {
    throw new DecodingError('Request has bad encoding')
  }
}

calcRouter.get('/', async (request, response, next) => {
  try {
    let rawString = request.query && request.query.query ? decode(request.query.query) : ''
    let preprocessed = preprocess(rawString)
    if (!preprocessed) {
      throw new InputError('Bad/no input given.')
    }
    else {
      let parsed = parser(preprocessed)
      response.json({
        error: false,
        result: parsed
      })
    }
  } catch (error) {
    next(error)
  }
})
module.exports = calcRouter