class InputError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InputError);
    }
  }
}

class DevisionByZeroError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InputError);
    }
  }
}
module.exports = {
  InputError, DevisionByZeroError
}