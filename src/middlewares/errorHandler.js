const asyncHandler = (fn) => {
  const callback = async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error("Something failed: ", err);
      res.json({
        status: "Error",
        error: {
            message: err.message
        },
      });
    }
  };

  return callback;
};

module.exports = asyncHandler;
