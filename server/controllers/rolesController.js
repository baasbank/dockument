import db from '../models';

const Role = db.Role;

/**
 * class to create roles
 * @class RolesController
 */
class RolesController {
  /**
   * Create a new role
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json - payload
   * @memberOf RolesController
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
            .then(role => res.status(201).send({
              message: 'Role created successfully',
              role: role.roleType }));
        } else {
          return res.status(400).send({
            message: 'roleType field is required.'
          });
        }
      });
  }
}

export default RolesController;

