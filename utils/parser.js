const { InputError, DevisionByZeroError } = require('../utils/errors')
const { matchRecursive, cache, test, match } = require('xregexp')
const CalcStringElement = require('../models/calcStringElement')

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
    throw new Error
  }
}

const createElementList = (preprocessedCalcString) => {
  let elementList = []
  let currentIndex = 0
  for (;;) {
    if (currentIndex >= preprocessedCalcString.length){
      break
    }
    let currentChar = preprocessedCalcString[currentIndex]
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
    else if (isOperator(currentChar)) {
      currentIndex++
      continue
    }
    else if (isAllNum(currentChar)) {
      let numberString = match(preprocessedCalcString.slice(currentIndex), catchAllNumPat, 'one')
      let cleanedNumberString = numberString.replace(/~{2}/,'')
      if (cleanedNumberString === '' || ( cleanedNumberString[0] === '~' && cleanedNumberString.length === 1)) {
        elementList =  elementList.concat([ new CalcStringElement(
          cleanedNumberString === 0 ? 1 : -1,
          '*',
          currentIndex !== 0 ? elementList[elementList.length - 1].nextOperator : null
        )])
        currentIndex += numberString.length
        continue
      }
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

const parseElements = (elementList) => {
  let result = elementList.reduce((previousValue, element) => {
    if (! element.lastOperator) {
      if (! element.nextOperator ) {
        return typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value))
      }
      return typeof element.value === 'number' ? [ element.value ] : [ parseElements(createElementList(element.value)) ]
    }
    else if (! element.nextOperator) {
      if (! previousValue[1]) {
        return calculator(
          previousValue[0],
          typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value)),
          element.lastOperator
        )
      }
      else {
        let tmp = calculator(
          previousValue[1].value,
          typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value)),
          element.lastOperator
        )
        return calculator(previousValue[0], tmp, previousValue[1]['lastOperator'])
      }
    }
    else {
      if ('+-'.includes(element.lastOperator)) {
        if (previousValue[1]) {
          let update = calculator(previousValue[0], previousValue[1].value, previousValue[1].lastOperator)
          return [
            update,
            {
              value: typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value)),
              lastOperator: element.lastOperator
            }
          ]
        }
        else {
          return [
            previousValue[0],
            {
              value: typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value)),
              lastOperator: element.lastOperator
            }
          ]
        }
      }
      else if ('*/'.includes(element.lastOperator)) {
        if (previousValue[1]) {
          let tmp = calculator(
            previousValue[1].value,
            typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value)),
            element.lastOperator
          )
          return [
            previousValue[0],
            {
              value: tmp,
              lastOperator: previousValue[1].lastOperator
            }
          ]
        }
        else {
          return [calculator(
            previousValue[0],
            typeof element.value === 'number' ? element.value : parseElements(createElementList(element.value)),
            element.lastOperator
          )]
        }
      }
      else {
        throw new Error('Unknown Error while reducing.')
      }
    }
  }, 0)
  return result
}

const parser = (preprocessedCalcString) => {
  let elementList = createElementList(preprocessedCalcString)
  let result = parseElements(elementList)
  return result
}

module.exports = { parser, createElementList, parseElements }