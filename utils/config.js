

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let PORT = process.env.PORT
//let SECRET_STRING = process.env.SECRET_STRING


module.exports = {
  PORT,
//  SECRET_STRING
}