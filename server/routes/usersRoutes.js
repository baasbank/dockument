const UsersController = require('../controllers/usersController');
// import UsersAuthentication from '../middlewares/UsersAuthentication';

/**
 * Define user routes
 * @param {function} router
 * @returns {void}
 */
const usersRoute = (router) => {
  // Create a new user, and get all users
  router.route('/users/')
    .post(UsersController.createUser)
    .get(UsersController.getAllUsers);

  router.route('/users/login')
    .post(UsersController.login);

  router.route('/users/:id')
    .get(UsersController.findAUser)
    .put(UsersController.updateUser)
    .delete(UsersController.deleteAUser);
};

module.exports = usersRoute;
