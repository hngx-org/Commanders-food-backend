const App = require("./app");
const UserRoute = require("./routes/user");

const server = new App();
server.initializedRoutes([new UserRoute()]);
server.listen();
