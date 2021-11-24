const { parseElements, createElementList } = require('../utils/parser')

test('Simple calcString with multiplication "4*5" is calculated correctly.', () => {
  let elementList = createElementList('4*5')
  let result = parseElements(elementList)
  expect(result).toBe(20)
})

test('Simple calcString with devision "4/5" is calculated correctly.', () => {
  let elementList = createElementList('4/5')
  let result = parseElements(elementList)
  expect(result).toBe(0.8)
})

test('Simple calcString with negations "4*~~5" is calculated correctly.', () => {
  let elementList = createElementList('4*~~5')
  let result = parseElements(elementList)
  expect(result).toBe(20)
})

test('Longer chain is "1*1+1*1*1/1-1" is calculated correctly.', () => {
  let elementList = createElementList('1*1+1*1*1/1-1')
  let result = parseElements(elementList)
  expect(result).toBe(1)
})

test('Simple nested structure is parsed correctly "(1+1)*1" is calculated correctly.', () => {
  let elementList = createElementList('(1+1)*1')
  let result = parseElements(elementList)
  expect(result).toBe(2)
})

test('Multiple nestings are parsed correctly: "(1*(1*1+(1-1)))*1".', () => {
  let elementList = createElementList('(1*(1*1+(1-1)))*1')
  let result = parseElements(elementList)
  expect(result).toBe(1)//(1*(1*1+(1-1)))*1)
})

test('Negations in nestings are parsed correctly: "(~1*(~1*~1+(1-1)))*~1".', () => {
  let elementList = createElementList('(~1*(~1*~1+(1-1)))*~1')
  let result = parseElements(elementList)
  expect(result).toBe(1)
})