const { DevisionByZeroError } = require('../utils/errors')

/**
 * Class, that accumulates the value for the parser and calculate the final result.
 * @property { null | number } first - representing the number value (or null) that has yet been accumulated
 * @property { null | object } second - representing the object (or null) that could not be calculated for elements that still stand out to be calculated.
 * @method addElement - Adds an element to the accumulator.
 * @method getResult - Getter for the current accumulated value, if the calculation would end at that point.
 * @method calculate - Calculates an expression.
 */
class AccumulatedValue {
  constructor() {
    this.first = null // representing the number value (or null) that has yet been accumulated
    this.second = null // representing the object (or null) that could not be calculated for elements yet standing out
  }
  /**
   * @param { number } value - value to be added
   * @param { string } operator - operator (character of the accepted operators) with which the number is connected to the current accumulated value
   */
  addElement(value, operator) {
    // if no value is set yet
    if (! this.first ) {
      if (operator) {
        throw new Error('Faulty element list.')
      }
      else {
        this.first = value
      }
    }
    // if only the number value is set
    else if (! this.second) {
      if ('+-'.includes(operator)) {
        this.second = {
          value,
          operator: operator
        }
      }
      else if ('*/'.includes(operator)){
        this.first = this.calculator(this.first, value, operator)
      }
      else {
        throw new Error(`Unkown Operator: ${operator}`)
      }
    }
    else {
      if ('+-'.includes(operator)) {
        this.first = this.calculator(this.first, this.second.value, this.second.operator)
        this.second = {
          value,
          operator: operator
        }
      }
      else if ('*/'.includes(operator)){
        this.second = {
          value: this.calculator(this.second.value, value, operator),
          operator: this.second.operator
        }
      }
      else {
        throw new Error(`Unkown Operator: ${operator}`)
      }
    }
  }
  get getResult() {
    return ! this.first
      ? 0
      : ! this.second
        ? this.first
        : this.calculator(this.first, this.second.value, this.second.operator)
  }
  /**
   * Calculates the result of two numbers connected with an operator.
   * @param { number} firstNum
   * @param { number } secondNum
   * @param { string } operator
   * @returns { number }
   */
  calculator(firstNum, secondNum, operator) {
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
}

module.exports = AccumulatedValue