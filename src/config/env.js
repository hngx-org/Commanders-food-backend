const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const LOCAL_MYSQL = "mysql://root:@localhost:3306/free-lunch";

const ENV = {
  jwtSecret: process.env.JWT_SECRET,
  mongoUrl: process.env.MONGODB,
  databaseUrl:
    process.env.NODE_ENV === "development"
      ? LOCAL_MYSQL
      : process.env.DATABASE_URL,
  backendURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : `https://freelunch.co`,
};

module.exports = ENV;
