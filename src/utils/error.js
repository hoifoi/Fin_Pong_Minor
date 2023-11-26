const throwErr = (code, message) => {
  const err = new Error(message);
  err.statusCode = code;
  throw err;
};

module.exports = {
  throwErr
}