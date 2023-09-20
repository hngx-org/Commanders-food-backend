const App = require('./app');
const UserRoute = require('./routes/user');
const LunchRoute = require('./routes/lunch');
const OrganizationRoute = require('./routes/organization');

const server = new App();
server.initializedRoutes([
  new UserRoute(),
  new LunchRoute(),
  new OrganizationRoute()
]);
server.listen();
