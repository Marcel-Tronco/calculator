/**
 * Class whose elements are fed into the parser.
 * @property { number | string } value - Either a number or a string yet to be parsed further.
 * @property { string } lastOperator - A character representing the operator with which the value is connected to the previous element.
 * @property { string } nextOperator - A character representing the operator with which the value is connected to the next element.
 */
class CalcStringElement {
  constructor(calcStringFragment, nextOperator, lastOperator) {
    this.value = calcStringFragment,
    this.lastOperator = lastOperator,
    this.nextOperator = nextOperator
  }
}


module.exports = CalcStringElement