const RolesController = require('../controllers/rolesController');
// import UsersAuthentication from '../middlewares/UsersAuthentication';

/**
 * Define roles routes
 * @param {function} router
 * @returns {void}
 */
const rolesRoute = (router) => {
  // Create a new role
  router.route('/roles')
    .post(RolesController.createRole);
};

module.exports = rolesRoute;
