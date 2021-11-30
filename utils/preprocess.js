const XRegExp = require('xregexp')
const { InputError } = require('./errors')
const illegalCombinationsPat = /(?:^[+*)])|(?:\(\))|(?:[+*/][+*/])|(?:-[+*/)])|(?:[0-9][~(])|(?:~[^~(0-9])|[^~()0-9/*+-]/
XRegExp.cache(illegalCombinationsPat)

/**
 * Preprocesses a query string and tests for general flaws.
 * @param { string } rawString - the decoded string from the query. 
 * @returns { string }
 */
const preprocess = (rawString) => {
  let preprocessed = rawString.replace(/\s/g,'')
  const signingMinusPat = /^-|(?<=[+\-/*(])-/g
  preprocessed = preprocessed.replace(signingMinusPat, '~')

  if (XRegExp.test(preprocessed, illegalCombinationsPat)) {
    throw new InputError(`Invalid input: wrong format or bad encoding. Decoded input:${rawString}`)
  }
  return preprocessed
}

module.exports = preprocess
