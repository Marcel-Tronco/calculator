const calcRouter = require('express').Router()
const parser = require('../utils/parser')
const preprocess = require('../utils/preprocess')
const { InputError } = require('../utils/errors')


const checkCache = (calcString) => {
  console.log("checkCache: Not implemented yet.")
  return None
}

const decode = (rawParam) => {
  console.log("decode: Not implemented yet.")
  return
}

calcRouter.get('/', async (request, response) => {
  if (cached = checkCache(request)) {
    response.json(blogs)
  }
  else {
    let rawString = decode(request.query.query)
    let preprocessed = preprocess(rawString)
    if (!preprocessed) {
      throw new InputError("Bad/no input given.")
    }
    else if (cached = checkCache(preprocessed)) {
      response.json(cached)
    }
    else {
      let parsed = parser(preprocessed)
      response.json({
        error: false,
        result: parsed
      })
    }
  }
})
module.exports = calcRouter