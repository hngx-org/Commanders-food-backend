const express = require("express");
const cors = require("cors");
const env = require("./config/env.js");
const { requestLogger } = require("./middlewares/logger.js");
const bodyParser = require("body-parser");
const HandleErrors = require("./middlewares/error.js");
const {isAuthenticated} = require("./middlewares/auth.js");
const logger = require("./config/logger.js");
const ENV = require("./config/env.js");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const swaggerFile = require("./documentation/swagger.js")

const swaggerDocument = YAML.parse(swaggerFile, 'utf8');
class App {
  constructor() {
    this.app = express();
    this.env = env;
    this.port = process.env.PORT ?? 8080;
    this.initializeMiddlewares();
  }

  initDB() {
    // * initialization of the database
  }

  initializeMiddlewares() {
    // initialize server middlewares
    this.app.use(requestLogger);
    this.app.use(
      cors({
        origin: ["http://127.0.0.1:3000", "http://localhost:3000", "*"],
        credentials: true,
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));  }

  listen() {
    // initialize database
    this.initDB();
    // listen on server port
    this.app.listen(this.port, () => {
      logger.info("Server started at http://localhost:" + this.port);
    });
  }

  initializedRoutes(routes) {
    // initialize all routes middleware
    routes.forEach((route) => {
      this.app.use("/api", route.router);
    });

    this.app.all("*", (req, res) => {
      return res.status(404).json({
        errorStatus: true,
        code: "--route/route-not-found",
        message: "The requested route was not found.",
      });
    });
    // handle global errors
    this.app.use(HandleErrors);
  }
}

module.exports = App;
