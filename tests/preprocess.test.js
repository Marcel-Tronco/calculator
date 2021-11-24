const preprocess = require('../utils/preprocess')

test('Cleaning whitespaces of "3  *3 "', () => {
  let result = preprocess('3  *3 ')
  expect(result).toBe('3*3')
})
test('Replace single signing "-" with "~"', () => {
  let result = preprocess('3*-4')
  expect(result).toBe('3*~4')
})
test('Replace single signing "-" with "~" infront of brackets: "-(3*-4)', () => {
  let result = preprocess('-(3*-4)')
  expect(result).toBe('~(3*~4)')
})


test('Replace multple signing "-" with "~"', () => {
  let result = preprocess('3*--4')
  expect(result).toBe('3*~~4')
})

test('Illegal Combination "()23*34)+1"', () => {
  try {
    preprocess('()23*34)+1')
  } catch (error) {
    expect(error.message).toBe('Invalid input: wrong format or bad encoding. Decoded input:()23*34)+1')
  }
})


test('Illegal Combination "*34+4"', () => {
  try {
    preprocess('*34+4')
  } catch (error) {
    expect(error.message).toBe('Invalid input: wrong format or bad encoding. Decoded input:*34+4')
  }
})