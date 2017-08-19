import RolesRoutes from './RolesRoutes';
import UsersRoutes from './UsersRoutes';
import DocumentsRoutes from './DocumentsRoutes';

/**
 * Combine roles, documents and users routes
 * @param {function} router
 * @returns {void}
 */
const routes = (router) => {
  RolesRoutes(router);
  UsersRoutes(router);
  DocumentsRoutes(router);
};

export default routes;
