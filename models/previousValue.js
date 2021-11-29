const { DevisionByZeroError } = require('../utils/errors')


class AccumulatedValue {
  constructor() {
    this.first = null // representing the number value (or null) that has yet been accumulated
    this.second = null // representing the object (or null) that could not be calculated for elements yet standing out
  }
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