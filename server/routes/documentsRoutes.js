import DocumentsController from '../controllers/DocumentsController';
import Authenticate from '../middleware/Authenticate';

/** 
 * @swagger
 * definitions:
 *   Document:
 *     type: object
 *     required:
 *     - title
 *     - content
 *     - accessType
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       title:
 *         type: string
 *         example:  Document one
 *       content:
 *         type: string
 *         example: Lorem Ipsum
 *       accessType:
 *         type: string
 *         example: public
 *       userId:
 *         type: integer
 *         example: 10
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
const documentsRoutes = (router) => {
  // Create a new document, and get all documents
  router.route('/documents/')
  /**
 * @swagger
 * paths: 
 *   /api/v1/documents/:
 *     get:
 *       tags:
 *         - Documents
 *       summary: Fetch all documents
 *       description: Get all documents.
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
 *           description: pagination limit
 *           required: false
 *         - in: query
 *           name: offset
 *           description: pagination offset
 *           required: false
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 documents: [
 *                   {
 *                     id: 1,
 *                     title: "My first document",
 *                     content: "lorem ipsum and the rest of it",
 *                     accessType: "public",
 *                     userId: 1
 *                   },
 *                   {
 *                     id: 4,
 *                     title: "My second document",
 *                     content: "second lorem ipsum and the rest of it",
 *                     accessType: "private",
 *                     userId: 2
 *                   }, 
 *                   {
 *                     id: 8,
 *                     title: "My third document",
 *                     content: "third lorem ipsum and the rest of it",
 *                     accessType: "role",
 *                     userId: 3
 *                   },
 *                   {
 *                     id: 20,
 *                     title: "My fourth document",
 *                     content: "fourth lorem ipsum and the rest of it",
 *                     accessType: "public",
 *                     userId: 2
 *                   }
 *      ]
 *    }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         400:
 *           description: Bad Request
 *           examples:
 *             application/json:
 *               {
 *                 message: "No documents found."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         500:
 *           description: Internal Server Error
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *       security:
 *       - Authorization: []
 *     post:
 *       tags:
 *         - Documents
 *       summary: Create a new document
 *       description: Allows a user create a new document.
 *       operationId: createNewDocument
 *       produces:
 *         - application/json
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true 
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
 *         description: who can access the document
 *         required: true
 *       responses:
 *         201:
 *           description: Created
 *           examples:
 *             application/json:
 *               {
 *                 message: 'Document created.',
 *                  document: {
 *                    id: 4,
 *                    title: Lovey Dovey,
 *                    content: I will conquer my opponent. Defeat will not be in my creed,
 *                    accessType: public,
 *                    userId: 5
 *                   } 
 *               }
 *           schema:
 *             $ref: '#/definitions/Document'
 *         400:
 *           description: Bad Request
 *           examples:
 *             application/json:
 *               {
 *                 message: "Title field is required."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         500:
 *           description: Internal Server Error
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *       security:
 *       - Authorization: []
 */ 
    .post(Authenticate.verifyToken, DocumentsController.createDocument)
    .get(Authenticate.verifyToken, DocumentsController.fetchAllDocuments);

  // get, update, and delete a document by its ID
  router.route('/documents/:id')
/**
 * @swagger
 * paths:
 *   /api/v1/documents/{id}:
 *     get:
 *       tags:
 *         - Documents
 *       summary: Fetch a document by id
 *       description: Fetch a document by id
 *       operationId: getDocument
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true 
 *         - name: id
 *           in: path
 *           description: id of the document the user wants.
 *           required: true
 *           type: integer
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 id: document.id,
 *                 title: document.title,
 *                 content: document.content,
 *                 accessType: document.accessType,
 *                 userId: document.userId 
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         403:
 *           description: Forbidden
 *           examples:
 *             application/json:
 *               {
 *                 message: "Private document."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         404:
 *           description: Not Found
 *           examples:
 *             application/json:
 *               {
 *                 message: "Document does not exist."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         500:
 *           description: Internal Server Error
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *       security:
 *       - Authorization: []
 *     put:
 *       tags:
 *         - Documents
 *       summary: Update a document
 *       description: Update a document.
 *       operationId: updateDocument
 *       produces:
 *         - application/json
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true 
 *         - name: id
 *           in: path
 *           description: id of the document that needs to be updated.
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
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 id: 5,
 *                 title: I'm way up,
 *                 content: I feel blessed.,
 *                 accessType: public,
 *                 userId: 9
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         403:
 *           description: Forbidden
 *           examples:
 *             application/json:
 *               {
 *               message: "Document ID cannot be changed."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         404:
 *           description: Not Found
 *           examples:
 *             application/json:
 *               {
 *                 message: "Document does not exist."
 *              }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         500:
 *           description: Internal Server Error
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *       security:
 *       - Authorization: []
 *     delete:
 *       tags:
 *         - Documents
 *       summary: Delete a document
 *       description: Delete a document by its id
 *       operationId: deleteDocument
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: token from login
 *           required: true 
 *         - name: id
 *           in: path
 *           description: id of the document that needs to be deleted.
 *           required: true
 *           type: integer
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 message: "Document deleted successfully."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         403:
 *           description: Forbidden
 *           examples:
 *             application/json:
 *               {
 *                 message: "You can delete only your documents."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         404:
 *           description: Not Found
 *           examples:
 *             application/json:
 *               {
 *                 message: "Document does not exist."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *         500:
 *           description: Internal Server Error
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: "#/definitions/Document"
 *       security:
 *       - Authorization: []
 */ 
    .get(Authenticate.verifyToken, DocumentsController.fetchDocumentById)
    .put(Authenticate.verifyToken, DocumentsController.updateDocumentById)
    .delete(Authenticate.verifyToken, DocumentsController.deleteDocumentById);

  // search for documents
  router.route('/search/documents')
  /** 
 * @swagger
 * paths:
 *   /api/v1/search/documents/:
 *      get:
 *        tags:
 *          - Documents
 *        summary: Search for a document by title
 *        description: Enter the title of a document to search for.
 *        operationId: searchDocuments
 *        produces:
 *          - application/json
 *        parameters:
 *          - in: header
 *            name: Authorization
 *            description: token from login
 *            required: true
 *          - name: q
 *            in: query
 *            description: title of document(s) to search
 *            required: true
 *            type: string
 *        responses:
 *          200:
 *            description: OK
 *            examples:
 *              application/json:
 *                {
 *                   pagination: {
 *                     totalCount: 1,
 *                     currentPage: 1,
 *                     pageCount: 1,
 *                     pageSize: 1
 *               },
 *                   users: [
 *               {
 *                     id: 1,
 *                     title: Successful,
 *                     content: Everyday in everyway, through the grace of God, I am,
 *                     accessType: public,
 *                     userId: 5
 *               }
 *             ]
 *            }
 *            schema:
 *              $ref: '#/definitions/Document'
 *          404:
 *            description: Not Found
 *            examples:
 *              application/json:
 *                {
 *                  message: "Search term does not match any document."
 *                }
 *            schema:
 *             $ref: "#/definitions/Document"
 *        security:
 *        - Authorization: []
 */                      
    .get(Authenticate.verifyToken, DocumentsController.searchForDocuments);
};

export default documentsRoutes;
