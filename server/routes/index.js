import rolesRoute from './rolesRoutes';
import usersRoute from './usersRoutes';
import documentsRoute from './documentsRoutes';

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

export default routes;
