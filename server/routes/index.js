const rolesRoute = require('./rolesRoutes');
const usersRoute = require('./usersRoutes');
const documentsRoute = require('./documentsRoutes');

/**
 * Combine roles, documents and users routes
 * @param {function} router
 * @returns {void}
 */
const routes = (router) => {
  rolesRoute(router);
  usersRoute(router);
  documentsRoute(router);
};

module.exports = routes;
