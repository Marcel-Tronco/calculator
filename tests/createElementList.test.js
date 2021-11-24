const createElementList = require('../utils/parser').createElementList

test('Element list of 4*3', () => {
  const result = createElementList('4*3')

  expect(result[0].value).toBe(4)
  expect(result[0].nextOperator).toBe('*')
  expect(result[1].nextOperator).toBeNull()
  expect(result[1].lastOperator).toBe('*')
  expect(result[1].value).toBe(3)
})

test('Element list of negated bracket is build correctly "3*~(1+1)"', () => {
  const result = createElementList('3*~(1+1)')
  expect(result.length).toBe(3)
  expect(result[1].value).toBe(-1)
  expect(result[2].value).toBe('1+1')
})

test('Element list of 4*(456*3)-5', () => {
  const result = createElementList('4*(456*3)-5')
  expect(result.length).toBe(3)
  expect(result[1].value).toBe('456*3')
})

test('Signing "-" is recognized in "3*~5"', () => {
  const result = createElementList('3*~5')
  expect(result[1].value).toBe(-5)
})