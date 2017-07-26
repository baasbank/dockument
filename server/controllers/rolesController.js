const db = require('../models');

const Role = db.Role;

/**
 * class to create and manage roles
 * @class rolesController
 */
class rolesController {
  /**
   * Create a new role
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json - payload
   * @memberOf rolesController
   */
  static createRole(req, res) {
    Role.findOne({ where: { roleType: req.body.roleType } })
      .then((existingRole) => {
        if (existingRole) {
          return res.status(200).send({
            message: 'Role already exists!',
          });
        }
        if (req.body.roleType) {
          Role.create({
            roleType: req.body.roleType,
          })
            .then(role => res.status(201).send(role))
            .catch(() => res.status(400).send({
              message: 'Error. Please try again!',
            }));
        } else {
          return res.status(400).send({
            message: 'roleType field is required.'
          });
        }
      });
  }
}

module.exports = rolesController;

