const { InputError, DevisionByZeroError } = require('../utils/errors')
const { matchRecursive, cache, test, match } = require('xregexp')
const CalcStringElement = require('../models/calcStringElement')
const PreviousValue = require('../models/previousValue')

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

const isOperator = (char) => {
  return test(char, /[+,\-,*,/]/)
}

const isAllNum = (char) => {
  return test(char, catchAllNumPat)
}

const isNum = (char) => {
  return isAllNum(char)
}

const calculator = (firstNum, secondNum, operator) => {
  switch (operator) {
  case '+':
    return firstNum + secondNum
  case '-':
    return firstNum - secondNum
  case '*':
    return firstNum * secondNum
  case '/': {
    let result = firstNum / secondNum
    if (result === Infinity || result === -Infinity) {
      throw new DevisionByZeroError('Calculation included devision by Zero')
    }
    else {
      return result
    }
  }
  default:
    throw new Error()
  }
}

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

const getValueRecursion = (element) => {
  return typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value))
}

const parseElements = (elementList) => {
  let result = elementList.reduce((previousValue, element) => {
    previousValue.addElement(getValueRecursion(element), element.lastOperator)
    if (! element.nextOperator) {
      return previousValue.getResult
    }
    else {
      return previousValue
    }
  }, new PreviousValue())
  return result
}

const parser = (preprocessedCalcString) => {
  let elementList = createElementList(preprocessedCalcString)
  let result = parseElements(elementList)
  return result
}

module.exports = { parser, createElementList, parseElements, calculator }