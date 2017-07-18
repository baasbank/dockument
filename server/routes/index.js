const rolesRoute = require('./rolesRoutes');
const usersRoute = require('./usersRoutes');

/**
 * Combine roles, documents and users routes
 * @param {function} router
 * @returns {void}
 */
const routes = (router) => {
  rolesRoute(router);
  usersRoute(router);
};

module.exports = routes;
