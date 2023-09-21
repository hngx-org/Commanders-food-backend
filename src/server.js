const App = require("./app");
const UserRoute = require("./routes/user");
const LunchRoute = require("./routes/lunch"); 
const OrganizationRoute = require("./routes/organization");
const AuthRoute = require("./routes/auth");
const WithdrawalController = require("./routes/withdrawal")

const server = new App();
server.initializedRoutes([
  new UserRoute(),
  new LunchRoute(),
  new AuthRoute(),
  new OrganizationRoute(),
  new WithdrawalController(),
]);
server.listen();
