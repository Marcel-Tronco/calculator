class InputError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InputError);
    }
    this.name = "InputError"
  }
}

class DevisionByZeroError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InputError);
    }
    this.name = "DevisionByZeroError"
  }
}

class DecodingError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InputError);
    }
    this.name = "DecodingError"
  }
}


module.exports = {
  InputError, DevisionByZeroError, DecodingError
}