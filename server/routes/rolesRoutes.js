import RolesController from '../controllers/rolesController';
import Authenticate from '../middleware/authenticate';

/**
 * Define roles routes
 * @param {function} router
 * @returns {void}
 */
const rolesRoute = (router) => {
  // Create a new role
  router.route('/roles')
    .post(Authenticate.verifyToken, Authenticate.hasAdminAccess, RolesController.createRole);
};

module.exports = rolesRoute;
