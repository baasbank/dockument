const DocumentsController = require('../controllers/documentsController');

/**
 * Define document routes
 * @param {function} router
 * @returns {void}
 */
const documentsRoute = (router) => {
  // Create a new user, and get all users
  router.route('/documents/')
    .post(DocumentsController.createDocument)
    .get(DocumentsController.getAllDocuments);

  // get or update document by its ID
  router.route('/documents/:id')
    .get(DocumentsController.findADocument)
    .put(DocumentsController.updateDocument);
};

module.exports = documentsRoute;
