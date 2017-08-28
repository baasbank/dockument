import rolesRoutes from './rolesRoutes';
import usersRoutes from './usersRoutes';
import documentsRoutes from './documentsRoutes';

/**
 * Combine roles, documents and users routes
 * @param {function} router
 * @returns {void}
 */
const routes = (router) => {
  rolesRoutes(router);
  usersRoutes(router);
  documentsRoutes(router);
};

export default routes;
