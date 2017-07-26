const UsersController = require('../controllers/usersController');
const authenticate = require('../middleware/authenticate');


/**
 * Define user routes
 * @param {function} router
 * @returns {void}
 */
const usersRoute = (router) => {
  // Create a new user, and get all users
  router.route('/users/')
    .post(UsersController.createUser)
    .get(authenticate.verifyToken, authenticate.hasAdminAccess, UsersController.getAllUsers);

  // Log a user in
  router.route('/users/login')
    .post(UsersController.login);

  // find a user, update user details, delete user.
  router.route('/users/:id')
    .get(authenticate.verifyToken, UsersController.findAUser)
    .put(authenticate.verifyToken, UsersController.updateUser)
    .delete(authenticate.verifyToken, authenticate.hasAdminAccess, UsersController.deleteAUser);

  // search for users by name
  router.route('/search/users/')
    .get(authenticate.verifyToken, authenticate.hasAdminAccess, UsersController.searchUsers);

  // search for users' document  
  router.route('/users/:id/documents')
    .get(authenticate.verifyToken, UsersController.getUserDocuments);
};

module.exports = usersRoute;
