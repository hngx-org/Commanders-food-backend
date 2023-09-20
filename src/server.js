const App = require('./app');
const UserRoute = require('./routes/user');
const LunchRoute = require('./routes/lunch');
const OrganisationRoute = require('./routes/organisation');

const server = new App();
server.initializedRoutes([new UserRoute(), new LunchRoute(), new OrganisationRoute()]);
server.listen();
