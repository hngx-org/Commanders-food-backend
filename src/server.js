const App = require("./app");
const UserRoute = require("./routes/user");
const LunchRoute = require("./routes/lunch");
const WithdrawRoute = require("./routes/withdrawal");

const server = new App();
server.initializedRoutes([new UserRoute(), new LunchRoute(), new WithdrawRoute()]);
server.listen();
