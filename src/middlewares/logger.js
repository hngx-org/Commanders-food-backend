const logger = require("../config/logger");

const requestLogger = (req, res, next) => {
  const { method, path } = req;
  return new Promise((resolve, reject) => {
    req.on("end", () => {
      const { statusCode } = res;
      console.log("");
      logger.info(`${method.toUpperCase()}: ${path} ${statusCode}`);
      resolve(1);
    });
  }).then(next());
};

module.exports = {
  requestLogger,
};
