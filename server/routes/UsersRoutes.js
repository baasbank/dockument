import UsersController from '../controllers/UsersController';
import Authenticate from '../middleware/Authenticate';

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
const UsersRoute = (router) => {
  // Create a new user, and get all users
  router.route('/users/')
/**
 * @swagger
 * paths:
 *   /api/v1/users/:
 *     get:
 *       tags:
 *         - User
 *       summary: Get all users
 *       operationId: getAllUsers
 *       description: Get all users. **admin only**
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
 *           schema:
 *             type: number
 *             example: 2
 *         - in: query
 *           name: offset
 *           description: Pagination offset
 *           required: false
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 allUsers: [
 *                   {
 *                   id: 1,
 *                   fullName: "Esther Falayi",
 *                   email: "fals@test.com",
 *                   roleType: "public"
 *                   },
 *                   {
 *                   id: 1,
 *                   fullName: "Esther Falayi",
 *                   email: "fals@test.com",
 *                   roleType: "public"
 *                   },
 *                   {
 *                   id: 1,
 *                   fullName: "Esther Falayi",
 *                   email: "fals@test.com",
 *                   roleType: "public"
 *                   },
 *                  ]
 *               }
 *           schema:
 *             $ref: '#/definitions/User'   
 *         400:
 *           description: Bad Request
 *           examples:
 *             application/json:
 *               {
 *                 message: "An error occurred."
 *               }
 *       security:
 *       - Authorization: []
 *     post:
 *       tags:
 *         - User
 *       summary: Create a new user
 *       operationId: createNewUser
 *       description: Adds a new user to the Users collection.
 *       consumes:
 *         - application/x-www-form-urlencoded
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
 *           description: Created
 *           examples:
 *             application/json:
 *               message: "signup successful"
 *               user: {
 *                 id: 5,
 *                  name: "Temi Lajumoke",
 *                  email: "temiboy@test.com",
 *                  roleType: "admin"
 *                 }
 *         400:
 *           description: Bad Request
 *           examples:
 *             application/json:
 *               {
 *                 message: "password field is required."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         500:
 *           description: Internal Server Error
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 */
    .get(Authenticate.verifyToken, Authenticate.hasAdminAccess, UsersController.getAllUsers)
    .post(UsersController.createUser);

  // Log a user in
  router.route('/users/login')
/**
 * @swagger
 * paths:
 *   /api/v1/users/login:
 *     post:
 *       tags:
 *         - User
 *       summary: Login a user
 *       operationId: login
 *       description: Logs in a user and provides them with a jwt token to access other routes.
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
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 token: "ewukjlvnfeoielfkmn94jdnkfkdjfkdkpojfkjfklsdkkdjksdklsdkfldfj"
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         400:
 *           description: Bad Request
 *           examples:
 *             application/json:
 *               {
 *                 message: "Password mismatch."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 */
    .post(UsersController.login);

  // find a user, update user details, delete user.
  router.route('/users/:id')
 /**
 * @swagger
 * paths:
 *   /api/v1/users/{id}:
 *     get:
 *       tags:
 *         - User
 *       summary: Get a user by id
 *       operationId: getAUser
 *       description: This route is used to get a specific user.
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: The id of the user to be retrieved
 *         required: true
 *         type: integer
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 id: 9,
 *                 name: "Temi Lajumoke",
 *                 email: "temiboy@test.com",
 *                 role: "admin"
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         400:
 *           description: Bad request.
 *           examples:
 *             application/json:
 *               {
 *                 message: "Cannot find user."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         500:
 *           description: Internal Server Error
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *       security:
 *       - Authorization: [] 
 *     put:
 *       tags:
 *         - User
 *       summary: Update user information
 *       description: Update user information.
 *       operationId: updateUser
 *       produces:
 *         - application/json
 *       consumes:
 *         - application/x-www-form-urlencoded
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: id of the user that needs to be updated
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
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 user: {
 *                    fullName: Baas Awesome Bank,
 *                    email: baas@test.com,
 *                    roleType: super user,
 *                    userId: 3
 *                  }
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         403:
 *           description: Forbidden.
 *           examples:
 *             application/json:
 *               {
 *                 message: "User id cannot be changed."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         404:
 *           description: Not Found.
 *           examples:
 *             application/json:
 *               {
 *                 message: "No such user."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         500:
 *           description: Internal Server Error
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *       security:
 *       - Authorization: []
 *     delete:
 *       tags:
 *         - User
 *       summary: Delete a user
 *       description: Delete a user.
 *       operationId: deleteUser
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: Id of the user that needs to be deleted
 *         required: true
 *         type: integer
 *       responses:
 *         404:
 *           description: Not Found
 *           examples:
 *             application/json:
 *               {
 *                 message: "User does not exist."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                 message: "User deleted successfully."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *         500:
 *           description: Internal Server Error.
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please try again."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *       security:
 *       - Authorization: [] 
 */        
    .get(Authenticate.verifyToken, UsersController.findAUser)
    .put(Authenticate.verifyToken, UsersController.updateUser)
    .delete(Authenticate.verifyToken, Authenticate.hasAdminAccess, UsersController.deleteAUser);

  // search for users by name
  router.route('/search/users/')
/** 
 * @swagger
 * paths:
 *   /api/v1/search/users/:
 *     get:
 *       tags:
 *         - User
 *       summary: Search user by name
 *       description: Find a user by the user's name
 *       operationId: searchUsers
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
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                  pagination: {
 *                    totalCount: 1,
 *                    currentPage: 1,
 *                    pageCount: 1,
 *                    pageSize: 1
 *                },
 *                  users: [
 *                    {
 *                      id: 1,
 *                      fullName: "Baas Bank",
 *                      email: "baas@test.com",
 *                      roleType: "admin"
 *                    }
 *                  ]
 *                }
 *           schema:
 *             $ref: '#/definitions/User'
 *         404:
 *           description: Not Found.
 *           examples:
 *             application/json:
 *               {
 *                 message: "Search term does not match any user."
 *               }
 *           schema:
 *             $ref: '#/definitions/User'
 *       security:
 *       - Authorization: [] 
 */
    .get(Authenticate.verifyToken, Authenticate.hasAdminAccess, UsersController.searchUsers);

  // search for users' document  
  router.route('/users/:id/documents')
/**
 * @swagger
 * paths:
 *   /api/v1/users/{id}/documents/ :
 *     get:
 *       tags:
 *         - User
 *       summary: Get all documents belonging to a user.
 *       operationId: getAUserDocuments
 *       description: Used to get a specific user. **admin only**
 *       produces:
 *         - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: token from login
 *         required: true
 *       - name: id
 *         in: path
 *         description: The id of the user whose documents is to be retrieved
 *         required: true
 *         type: integer
 *       responses:
 *         200:
 *           description: OK
 *           examples:
 *             application/json:
 *               {
 *                  pagination: {
 *                    totalCount: 1,
 *                    currentPage: 1,
 *                    pageCount: 1,
 *                    pageSize: 1
 *                },
 *                  documents: [
 *                  {
 *                    id: 1,
 *                    title: My first document,
 *                    content: lorem ipsum and the rest of it,
 *                    access: public,
 *                    userId: 1
 *                  }
 *               ]
 *             }
 *           schema:
 *             $ref: '#/definitions/Document' 
 *         400:
 *           description: Bad Request
 *           examples:
 *             application/json:
 *               {
 *                 message: "Error. Please check the id and try again."
 *               }
 *         403:
 *           description: Forbidden
 *           examples:
 *             application/json:
 *               {
 *                 message: "You cannot view another user document.."
 *               }
 *         404:
 *           description: Not Found
 *           examples:
 *             application/json:
 *               {
 *                 message: "This user does not have any document."
 *               }
 *       security:
 *       - Authorization: []
 */ 
    .get(Authenticate.verifyToken, UsersController.getUserDocuments);
};

export default UsersRoute;
