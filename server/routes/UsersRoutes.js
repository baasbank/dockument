import usersController from '../controllers/usersController';
import authenticate from '../middleware/authenticate';

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *     - fullName
 *     - email
 *     - password
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       fullName:
 *         type: string
 *         example: Giovanni Deluna
 *       email:
 *         type: string
 *         example: giovanni@cold.com
 *       password:
 *         type: string
 *         example: password
 *       roleType:
 *         type: string
 *         example: admin
 *       createdAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29T09:12:33.001Z
 *       updatedAt:
 *         type: string
 *         format: int32
 *         example: 2016-08-29T09:12:33.001Z
 *   Document:
 *     type: object
 *     required:
 *     - title
 *     - content
 *     - accessType
 *     - UserId
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       title:
 *         type: string
 *         example:  I'm a banana
 *       content:
 *         type: string
 *         example: Lorem Ipsum
 *       accessType: 
 *         type: integer
 *         example: 2
 *       UserId:
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
 * Define user routes
 * @param {function} router
 * @returns {void}
 */
const usersRoute = (router) => {
  // Create a new user, and get all users
  router.route('/users/')
/**
 * @swagger
 * paths:
 *   /api/v1/users/:
 *     get:
 *       tags:
 *         - User
 *       summary: gets all users
 *       operationId: fetchAllUsers
 *       description: |
 *         This route is only accessible to an admin to enable her get all users.
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
 *           description: all users in the database
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/User'
 *         400:
 *           description: bad input parameter
 *       security:
 *       - Authorization: []
 *     post:
 *       tags:
 *         - User
 *       summary: adds a new user
 *       operationId: createNewUser
 *       description: Adds a new user to the Users collection
 *       consumes:
 *         - application/json
 *       produces:
 *         - application/json
 *       parameters:
 *         - in: formData
 *           name: fullName
 *           description: User's full name
 *           required: true
 *         - in: formData
 *           name: email
 *           description: User's email address
 *           required: true
 *         - in: formData
 *           name: password
 *           description: User's password
 *           required: true
 *       responses:
 *         201:
 *           description: User created
 *         400:
 *           description: invalid input, object invalid
 *         409:
 *           description: an existing item already exists
 */
    .get(authenticate.verifyToken, authenticate.hasAdminAccess, usersController.getAllUsers)
    .post(usersController.createUser);

  // Log a user in
  router.route('/users/login')
/**
 * @swagger
 * paths:
 *   /api/v1/users/login:
 *     post:
 *       tags:
 *         - User
 *       summary: logs in a user
 *       operationId: login
 *       description: Logs in a user and provides them with a jwt token to access other routes
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       produces:
 *         - application/json
 *       parameters:
 *       - name: email
 *         in: formData
 *         description: The user's email address
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         description: The password for login in clear text
 *         required: true
 *         type: string
 *       responses:
 *         200:
 *           description: User logged in successfully
 *           schema:
 *             type: string
 *           headers:
 *             Authorization:
 *               type: string
 *               format: int32
 *               description: stores user jwt token
 *         400:
 *           description: User not found
 *         401:
 *           description: Invalid password or username
 */
    .post(usersController.login);

  // find a user, update user details, delete user.
  router.route('/users/:id')
 /**
 * @swagger
 * paths:
 *   api/v1//users/:id :
 *     get:
 *       tags:
 *         - User
 *       summary: gets a user by id
 *       operationId: getAUser
 *       description: |
 *         This route is used to get a specific user.
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: query
 *         description: The id of the user to be retrieved
 *         required: true
 *         type: integer
 *       responses:
 *         200:
 *           description: a user
 *           schema:
 *             type: object
 *             items:
 *               $ref: '#/definitions/User'
 *         400:
 *           description: bad input parameter
 *       security:
 *       - Authorization: [] 
 *     put:
 *       tags:
 *         - User
 *       summary: Updates user information
 *       description: This can only be done by the logged in user.
 *       operationId: updateUser
 *       produces:
 *         - application/xml
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: query
 *         description: name that need to be updated
 *         required: true
 *         type: integer
 *       - in: formData
 *         name: fullName
 *         description: New name
 *         required: false
 *       - in: formData
 *         name: email
 *         description: New email address
 *         required: false
 *       - in: formData
 *         name: password
 *         description: New password
 *         required: false
 *       - in: formData
 *         name: roleType
 *         description: New role type (only for admin)
 *         required: false
 *       responses:
 *         200:
 *           description: ''
 *           schema:
 *             "$ref": "#/definitions/User"
 *         400:
 *           description: Invalid user supplied
 *         403:
 *           description: You dont have that kinda privilege
 *       security:
 *       - Authorization: []
 *     delete:
 *       tags:
 *         - User
 *       summary: Deletes user from system
 *       description: This can only be done by the logged in user.
 *       operationId: deleteUser
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: query
 *         description: Id of the user that needs to be deleted
 *         required: true
 *         type: integer
 *       responses:
 *         203:
 *           description: User deleted
 *         403:
 *           description: You dont have that privilege
 *       security:
 *       - Authorization: [] 
 */         
    .get(authenticate.verifyToken, usersController.findAUser)
    .put(authenticate.verifyToken, usersController.updateUser)
    .delete(authenticate.verifyToken, authenticate.hasAdminAccess, usersController.deleteAUser);

  // search for users by name
  router.route('/search/users/')
/** 
 * @swagger
 * paths:
 *   api/v1/search/users:
 *     get:
 *       tags:
 *         - User
 *       summary: Get user by user name
 *       description: Find a user by the user's name
 *       operationId: getAllUsers
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: search
 *         in: query
 *         description: The name of the user that needs to be fetched.
 *         required: true
 *         type: string
 *       responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             "$ref": "#/definitions/User"
 *         400:
 *           description: Invalid username supplied
 *       security:
 *       - Authorization: [] 
 */
    .get(authenticate.verifyToken, authenticate.hasAdminAccess, usersController.searchUsers);

  // search for users' document  
  router.route('/users/:id/documents')
/**
 * @swagger
 * paths:
 *   /api/v1/users/:id/documents :
 *     get:
 *       tags:
 *         - User
 *       summary: gets a user by id
 *       operationId: getAUser
 *       description: |
 *         This route is used to get a specific user.
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: query
 *         description: The id of the user whose documents is to be retrieved
 *         required: true
 *         type: integer
 *       responses:
 *         200:
 *           description: a user
 *           schema:
 *             type: object
 *             items:
 *               $ref: '#/definitions/Document'
 *         400:
 *           description: bad input parameter
 *       security:
 *       - Authorization: []
 */ 
    .get(authenticate.verifyToken, usersController.getUserDocuments);
};

export default usersRoute;
