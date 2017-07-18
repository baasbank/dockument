const UsersController = require('../controllers/usersController');
// import UsersAuthentication from '../middlewares/UsersAuthentication';

/**
 * Define roles routes
 * @param {function} router
 * @returns {void}
 */
const usersRoute = (router) => {
  // Create a new role
  router.route('/users/')
    .post(UsersController.createUser);

  router.route('/users/login')
    .post(UsersController.login);
};

module.exports = usersRoute;
