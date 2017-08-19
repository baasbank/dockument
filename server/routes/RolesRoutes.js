import RolesController from '../controllers/RolesController';
import Authenticate from '../middleware/Authenticate';

/**
 * @swagger
 * definitions:
 *   Role:
 *     type: object
 *     required:
 *     - roleType
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
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
 * Define roles routes
 * @param {function} router
 * @returns {void}
 */
const RolesRoutes = (router) => {
  // Create a new role
  router.route('/roles')
/** 
 * @swagger
 * paths:
 *   /api/v1/roles:
 *     post:
 *        tags:
 *          - Role
 *        summary: Create a new role
 *        description: Add a new role to already existing roles.
 *        operationId: addRole
 *        produces:
 *          - application/json
 *        parameters:
 *          - in: header
 *            name: Authorization
 *            description: token from login
 *            required: true 
 *          - in: formData
 *            name: roleType
 *            description: role to be added
 *            required: true
 *        responses:
 *          200:
 *            description: OK
 *            examples:
 *              application/json:
 *                {
 *                  message: "Role already exists."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
 *          201:
 *            description: Created
 *            examples:
 *              application/json:
 *                {
 *                  message: "Role created successfully."
 *                }
 *            schema:
 *              $ref: '#/definitions/Role'
 *          400:
 *            description: Bad Request
 *            examples:
 *                application/json:
 *                  {
 *                  message: "roleType field is required."
 *                  }
 *            schema:
 *              $ref: '#/definitions/Role'
 *        security:
 *        - Authorization: []
 */
    .post(Authenticate.verifyToken, Authenticate.hasAdminAccess, RolesController.createRole);
};

export default RolesRoutes;
