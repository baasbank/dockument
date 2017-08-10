import DocumentsController from '../controllers/DocumentsController';
import Authenticate from '../middleware/Authenticate';

/** 
 * @swagger
 * definitions:
 *   Document:
 *     type: object
 *     required:
 *     - id
 *     - title
 *     - body
 *     - authorId
 *     - access
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       title:
 *         type: string
 *         example:  Document one
 *       body:
 *         type: string
 *         example: Lorem Ipsum
 *       authorId: 
 *         type: integer
 *         example: 1
 *       access:
 *         type: string
 *         example: public
 *       createdAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29T09:12:33.001Z
 *       updatedAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29T09:12:33.001Z
 */

// Security schema definition
/**
 * @swagger
 * securityDefinitions:
 *   Authorization:
 *     type: apiKey
 *     description: JWT Token
 *     in: header
 *     name: Authorization 
 */
/**
 * Define document routes
 * @param {function} router
 * @returns {void}
 */
const DocumentsRoute = (router) => {
  // Create a new user, and get all users
  router.route('/documents/')
/**
 * @swagger
 * paths: 
 *   /api/v1/documents/:
 *     get:
 *       tags:
 *         - Documents
 *       summary: Returns all documents
 *       description: ''
 *       operationId: fetchAllDocuments
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true      
 *         - in: query
 *           name: limit
 *           description: Pagination limit
 *           required: false
 *         - in: query
 *           name: offset
 *           description: Pagination offset
 *           required: false
 *       responses:
 *         200:
 *           description: Document created
 *           schema:
 *             "$ref": "#/definitions/Document"
 *         400:
 *           description: An error occurred.
 *       security:
 *       - Authorization: []
 *     post:
 *       tags:
 *         - Documents
 *       summary: Create a new document
 *       description: ''
 *       operationId: createNewDocument
 *       produces:
 *         - application/json
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *       - in: formData
 *         name: title
 *         description: document title
 *         required: true
 *       - in: formData
 *         name: content
 *         description: document content
 *         required: true
 *       - in: formData
 *         name: accessType
 *         description: Who can access the document
 *         required: true
 *       - in: formData
 *         name: userId
 *         description: id of the owner 
 *         required: true
 *       responses:
 *         201:
 *           description: Document created
 *           schema:
 *             "$ref": '#/definitions/Document'
 *         400:
 *           description: Error. Please try again.
 *         206:
 *           description: All fields are required.
 *       security:
 *       - Authorization: []
 */ 
    .post(Authenticate.verifyToken, DocumentsController.createDocument)
    .get(Authenticate.verifyToken,
      DocumentsController.getAllDocuments);

  // get, update, and delete a document by its ID
  router.route('/documents/:id')
/**
 * @swagger
 * paths:
 *   /api/v1/documents/:id:
 *     get:
 *       tags:
 *         - Documents
 *       summary: Get document by id
 *       description: ''
 *       operationId: fetchDocument
 *       produces:
 *         - application/json
 *       parameters:
 *         - name: id
 *           in: query
 *           description: The id of the document the user wants.
 *           required: true
 *           type: integer
 *       responses:
 *         200:
 *           description: ''
 *           schema:
 *             "$ref": "#/definitions/Document"
 *         400:
 *           description: Database error
 *         403:
 *           description: Access denied
 *         404:
 *           description: Document not found
 *       security:
 *       - Authorization: []
 *     put:
 *       tags:
 *         - Documents
 *       summary: Updates a document
 *       description: This can only be done by the author
 *       operationId: updateDocument
 *       produces:
 *         - application/json
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *         - name: id
 *           in: query
 *           description: document title that need to be updated
 *           required: true
 *           type: integer
 *         - in: formData
 *           name: title
 *           description: new title
 *           required: false
 *         - in: formData
 *           name: content
 *           description: new content
 *           required: false
 *         - in: formData
 *           name: accessType
 *           description: new access type
 *           required: false
 *       responses:
 *         200:
 *           description: ''
 *           schema:
 *             "$ref": "#/definitions/Document"
 *         400:
 *           description: Invalid document id supplied
 *         403:
 *           description: You dont have that kinda privilege
 *       security:
 *       - Authorization: []
 *     delete:
 *       tags:
 *         - Documents
 *       summary: Deletes document from system
 *       description: This can only be done by the author
 *       operationId: deleteDocument
 *       produces:
 *         - application/json
 *       parameters:
 *         - name: id
 *           in: query
 *           description: The document that needs to be deleted
 *           required: true
 *           type: integer
 *       responses:
 *         203:
 *           description: Document deleted
 *         403:
 *           description: You dont have that privilege
 *       security:
 *       - Authorization: []
 */ 
    .get(Authenticate.verifyToken, DocumentsController.findADocument)
    .put(Authenticate.verifyToken, DocumentsController.updateDocument)
    .delete(Authenticate.verifyToken, DocumentsController.deleteADocument);

  // search for documents
  router.route('/search/documents')
/** 
 * @swagger
 * paths:
 *   /api/v1/search/documents:
 *      get:
 *        tags:
 *          - Documents
 *        summary: Fetch documents using a search parameter
 *        description: ''
 *        operationId: fetchAllDocuments.
 *        produces:
 *          - application/json
 *        parameters:
 *          - name: title
 *            in: query
 *            description: 'The name that needs to be fetched. Use pepper for testing. '
 *            required: true
 *            type: string
 *        responses:
 *          200:
 *            description: successful operation
 *            schema:
 *              "$ref": '#/definitions/Document'
 *          400:
 *            description: Invalid title supplied
 *        security:
 *        - Authorization: []
 */           
    .get(Authenticate.verifyToken, DocumentsController.searchDocuments);
};

export default DocumentsRoute;
