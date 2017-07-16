const rolesRoute = require('./rolesRoutes');

/**
 * Combine roles, documents and users routes
 * @param {function} router
 * @returns {void}
 */
const routes = (router) => {
  rolesRoute(router);
};

module.exports = routes;
