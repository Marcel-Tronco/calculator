class CalcStringElement {
  constructor(calcStringFragment, nextOperator, lastOperator) {
    this.value = calcStringFragment,
    this.lastOperator = lastOperator,
    this.nextOperator = nextOperator
  }
}

module.exports = CalcStringElement