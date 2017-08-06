const DocumentsController = require('../controllers/documentsController');
const authenticate = require('../middleware/authenticate');


/**
 * Define document routes
 * @param {function} router
 * @returns {void}
 */
const documentsRoute = (router) => {
  // Create a new user, and get all users
  router.route('/documents/')
    .post(authenticate.verifyToken, DocumentsController.createDocument)
    .get(authenticate.verifyToken,
      DocumentsController.getAllDocuments);

  // get, update, and delete a document by its ID
  router.route('/documents/:id')
    .get(authenticate.verifyToken, DocumentsController.findADocument)
    .put(authenticate.verifyToken, DocumentsController.updateDocument)
    .delete(authenticate.verifyToken, DocumentsController.deleteADocument);

  // search for documents
  router.route('/search/documents')
    .get(authenticate.verifyToken, DocumentsController.searchDocuments);
};

module.exports = documentsRoute;
