const { parser } = require('../utils/parser')
const preprocess = require('../utils/preprocess')

test('Integration test with simple calculation "3*4"', () => {
  let preprocessed = preprocess('3*4')
  let result = parser(preprocessed)
  expect(result).toBe(12)
})

test('Integration test with "1 ( (2 * (3 -1) / 4 + 4) * (2))"', () => {
  let preprocessed = preprocess('1 *( (2 * (3 -1) / 4 + 4) * (2))')
  let result = parser(preprocessed)
  expect(result).toBe(10)
})

test('Integration test with order of negations being important  "-(3+(-4))"', () => {
  let preprocessed = preprocess('-(3+(-4))')
  let result = parser(preprocessed)
  expect(result).toBe(1)
})

test('Integration test with some negations "-1 ( (--2 * (3 -1) / 4 + 4) * (-2))"', () => {
  let preprocessed = preprocess('1 *( (2 * (3 -1) / 4 + 4) * (2))')
  let result = parser(preprocessed)
  expect(result).toBe(10)
})