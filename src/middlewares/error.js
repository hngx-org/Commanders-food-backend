const logger = require("../config/logger");

function HandleErrors(err, req, res, next) {
  logger.error(err);

  res.status(500).json({
    errorStatus: true,
    statusCode: 500,
    code: "--api/server-error",
    message: "Something went wrong",
    details: {
      stacks: process.env.NODE_ENV !== "production" && err?.stack,
    },
  });
}

module.exports = HandleErrors;
