const DocumentsController = require('../controllers/documentsController');

/**
 * Define document routes
 * @param {function} router
 * @returns {void}
 */
const documentsRoute = (router) => {
  // Create a new user, and get all users
  router.route('/documents/')
    .post(DocumentsController.createDocument);
};

module.exports = documentsRoute;
