import RolesRoute from './RolesRoutes';
import UsersRoute from './UsersRoutes';
import DocumentsRoute from './DocumentsRoutes';

/**
 * Combine roles, documents and users routes
 * @param {function} router
 * @returns {void}
 */
const routes = (router) => {
  RolesRoute(router);
  UsersRoute(router);
  DocumentsRoute(router);
};

export default routes;
