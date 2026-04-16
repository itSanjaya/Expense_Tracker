module.exports = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    data: null,
    meta: {},
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
};