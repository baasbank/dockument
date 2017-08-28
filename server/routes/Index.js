import rolesRoutes from './RolesRoutes';
import usersRoutes from './UsersRoutes';
import documentsRoutes from './DocumentsRoutes';

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
