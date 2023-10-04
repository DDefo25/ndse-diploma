module.exports = (error, res) => {
  const {
    code,
    message,
  } = error;
  res.status(!code || code < 400 || code > 599 ? 500 : code).json({
    error: message,
    status: 'error',
  });
};
