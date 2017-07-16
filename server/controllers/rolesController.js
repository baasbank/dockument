const db = require('../models');

const Role = db.Role;

/**
 * RolesController class to create and manage roles
 * @class RolesController
 */
class rolesController {
  /**
   * Create a new Role
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {number} status - Status code
   * @memberOf RolesController
   */
  static createRole(req, res) {
    Role.findOne({ where: { roleType: req.body.roleType } })
      .then((existingRole) => {
        if (existingRole) {
          return res.status(200).send({
            message: 'This Role already exists!',
          });
        }
        if (req.body.roleType) {
          Role.create({
            roleType: req.body.roleType,
          })
            .then(role => res.status(201).send(role))
            .catch(() => res.status(400).send({
              message: 'An error occured. Invalid parameters, try again!',
            }));
        } else {
          return res.status(400).send({
            message: 'role type field is required.'
          });
        }
      });
  }
}

module.exports = rolesController;

