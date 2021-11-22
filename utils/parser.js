/**
 * ### Pseudocode:
 * 0. parse a general structure of the top level.
 * 1. find the first +- operators with filtering the signing "-" outside brackets
 *   --> the result is the parsing operation of the first part +- the result of the second part
 * 2. if no +- outside brackets: search for * /
 * --> the result is the result of parsing the first part * / by the second
 * 3. if no * / outside brackets look for encapsulating brackets
 * --> result is parsing the inner part
 * 4. look for negative signs:
 *  --> result is -1 times the inner part
 * 5. result is all num
 * --> result is the result cast to int
 */
/*

 2 * (23/(3*3))- 23 * (2*3)

  let structureElements = [
    {
      value: "2",
      lastOperator:None,
      nextOperator:"*"
    },
    {
      value:"(23/(3*3))"
      lastOperator:*
      nextOperator:-
    }
    ...
]
*/

const parser = (preprocessedCalcString) => {
  console.log("parser: Not implemented yet.")
  return preprocessedCalcString
}

module.exports = parser