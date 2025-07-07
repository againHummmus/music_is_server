module.exports = (err, req, res, next) => {
    console.error('from middleware', err.message);
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Unexpected Server Error :^(',
      },
    });
  };