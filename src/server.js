const App = require("./app");
const UserRoute = require("./routes/user");
const LunchRoute = require("./routes/lunch") 

const server = new App();
server.initializedRoutes([new UserRoute(), new LunchRoute()]);
server.listen();
