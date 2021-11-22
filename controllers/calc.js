const calcRouter = require('express').Router()
const parser = require('../utils/parser')
const preprocess = require('../utils/preprocess')

class InputError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InputError);
    }
  }
}

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
    else if (cached = checkCache(preprocess)) {
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
