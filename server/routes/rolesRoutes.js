import RolesController from '../controllers/rolesController';
import Authenticate from '../middleware/authenticate';

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
const rolesRoute = (router) => {
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
 *        description: Add a new role to already existing roles
 *        operationId: addRole
 *        produces:
 *          - application/json
 *        parameters:
 *          - in: formData
 *            name: roleType
 *            description: role to be added
 *            required: true
 *        responses:
 *          201:
 *            description: Role inserted
 *            schema:
 *              "$ref": '#/definitions/Role'
 *          400:
 *            description: Access Denied
 *        security:
 *        - Authorization: []
 */
    .post(Authenticate.verifyToken, Authenticate.hasAdminAccess, RolesController.createRole);
};

module.exports = rolesRoute;
