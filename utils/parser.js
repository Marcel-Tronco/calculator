const { InputError } = require('../utils/errors')
const { matchRecursive, cache, test, match } = require('xregexp')
const CalcStringElement = require('../models/calcStringElement')
const PreviousValue = require('../models/previousValue')

/**
 * Finds the closing parenthesis of a calcString, if no matching parenthesis is present an Error is thrown.
 * @param { string } - subString
 * @returns { number }
 */
const findClosingBracket = (subString) => {
  try {
    let result = matchRecursive(subString, '\\(', '\\)', '', { valueNames: [null, null, null, 'rightDel'] })
    let closingBracketIndex = result[0]['start']
    return closingBracketIndex
  } catch (error) {
    throw new InputError('Invalid sequence: Missing closing bracket')
  }
}

// preload relevant regexes
const operatorPat = '[+,-,*,/]'
cache(operatorPat)
const catchAllNumPat = /(~*[0-9]*)/g
cache(catchAllNumPat)

/**
 * returns wether a a character is a valid mathematical operator for the calculator
 * @param { string } char - Character to be tested
 * @returns { boolean }
 */
const isOperator = (char) => {
  return test(char, /[+,\-,*,/]/)
}

/**
 * returns wether a string consists only of characters associated with a number in the sense of the calculator.
 * @param { string } string - String to be tested.
 * @returns { boolean }
 */
const isAllNum = (string) => {
  return test(string, catchAllNumPat)
}

/**
 * returns wether a character belongs to the list of values associated with a number in the sense of the calculator.
 * @param { string} char - Character to be tested
 * @returns { boolean }
 */
const isNum = (char) => {
  return isAllNum(char)
}
/**
 * Converts a preprocessed CalcString to an Array of CalcStringElements.
 * @param { string } preprocessedCalcString - string to be converted
 * @returns { Array[CalcStringElement] }
 */
const createElementList = (preprocessedCalcString) => {
  let elementList = []
  let currentIndex = 0

  // The loop parses the characters in custom steps until the end of the string is reached
  while (currentIndex < preprocessedCalcString.length) {
    let currentChar = preprocessedCalcString[currentIndex]
    // if a parenthesis is found the closing bracket will be searched and the elements value gets the string inside
    if (currentChar === '(') {
      let closingBracketIndex = currentIndex + findClosingBracket(preprocessedCalcString.slice(currentIndex))
      elementList = elementList.concat([ new CalcStringElement(
        preprocessedCalcString.slice(currentIndex + 1, closingBracketIndex),
        closingBracketIndex !== preprocessedCalcString.length - 1 ? preprocessedCalcString[closingBracketIndex + 1] : null,
        currentIndex !== 0 ? elementList[elementList.length - 1].nextOperator : null
      )])
      currentIndex = closingBracketIndex + 1
      continue
    }
    // if an operator is found we continue to the next character
    else if (isOperator(currentChar)) {
      currentIndex++
      continue
    }
    // if the character is a number or a sign, a number element will be created
    else if (isNum(currentChar)) {
      let numberString = match(preprocessedCalcString.slice(currentIndex), catchAllNumPat, 'one')
      let cleanedNumberString = numberString.replace(/~{2}/,'')
      // special case if either character was a sign and no number follows e.g. if it was infront of parenthesis
      if (cleanedNumberString === '' || ( cleanedNumberString[0] === '~' && cleanedNumberString.length === 1)) {
        elementList =  elementList.concat([ new CalcStringElement(
          cleanedNumberString === 0 ? 1 : -1,
          '*',
          currentIndex !== 0 ? elementList[elementList.length - 1].nextOperator : null
        )])
        currentIndex += numberString.length
        continue
      }
      // otherwise the number including its sign is the value of the element
      // custom step will be after the end of the number string
      else {
        let numResult = cleanedNumberString[0] === '~' ? - parseInt(cleanedNumberString.slice(1)) : parseInt(cleanedNumberString)
        elementList = elementList.concat([ new CalcStringElement(
          numResult,
          currentIndex + numberString.length !== preprocessedCalcString.length ? preprocessedCalcString[currentIndex + numberString.length] : null,
          currentIndex !== 0 ? elementList[elementList.length - 1].nextOperator : null
        )])
        currentIndex = currentIndex + numberString.length
        continue
      }
    }
    else {
      throw new Error('Unknown error occured.')
    }
  }
  return elementList
}

/**
 * Manages the recursion and returns final value of an element.
 * @param { CalcStringElement } element - CalcStringElement of which final value should be gathered.
 * @returns { number }
 */
const valueRecursion = (element) => {
  return typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value))
}

/**
 * Parses the elements of an Element list to a final value.
 * @param {Array[CalcStringElement]} elementList - The array of CalcStringElements to be parsed
 * @returns { number }
 */
const parseElements = (elementList) => {
  let result = elementList.reduce((previousValue, element) => {
    previousValue.addElement(valueRecursion(element), element.lastOperator)
    if (! element.nextOperator) {
      return previousValue.getResult
    }
    else {
      return previousValue
    }
  }, new PreviousValue())
  return result
}

/**
 * Overal process that transforms a preprocessed string to the final result.
 * @param { string } preprocessedCalcString - the preprocessed input string to be parsed.
 * @returns { number }
 */
const parser = (preprocessedCalcString) => {
  let elementList = createElementList(preprocessedCalcString)
  let result = parseElements(elementList)
  return result
}

module.exports = { parser, createElementList, parseElements }