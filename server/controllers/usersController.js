const db = require('../models');
const Helper = require('../helper/Helper');

const User = db.User;
// const Role = db.Role;
// const Document = db.Document;
// const secret = process.env.SECRET || 'mySecret';

/**
 * UsersController class to create and manage users
 *
 * @class UsersController
 */
class usersController {
/**
   * Create a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {number} status - Status code
   * @memberOf UsersController
   */
  static createUser(req, res) {
    User.findOne({ where: { email: req.body.email } })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(200).send({
            message: 'User already exists!',
          });
        }
        if (req.body.name &&
        req.body.email &&
        req.body.password) {
          User.create({
            fullName: req.body.name,
            email: req.body.email,
            password: req.body.password,
            roleType: 'regular user',
          })
            .then((user) => {
              res.status(201).send({
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  roleType: user.roleType,
                },
              });
            })
            .catch(() => res.status(400).send({
              message: 'An error occured. Invalid parameters, try again!',
            }));
        } else {
          return res.status(200).send({
            message: 'All fields are required.'
          });
        }
      });
  }

  /**
   * Login a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {number} status - Status code
   * @memberOf UsersController
   */
  static login(req, res) {
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!req.body.password) {
          return res.status(200)
            .send({ message: 'Invalid login credentials. Try again!' });
        }
        if (user) {
          return res.status(200).send({
            userId: user.id,
            roleType: user.roleType,
          });
        }
        res.status(200)
          .send({ message: 'Invalid login credentials. Try again!' });
      });
  }

  /**
   * Logout a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {void}
   * @memberOf UsersController
   */
  static logout(req, res) {
    res.status(200)
      .send({ message: 'User logged out successfully' });
  }

  /**
   * List all users
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {number} status - Status code
   * @memberOf UsersController
   */
  static getAllUsers(req, res) {
    User.findAll()
      .then((users) => {
        res.status(200).send(
          users.map((user) => {
            return (
              {
                name: user.fullName,
                email: user.email,
                role: user.roleType,
              }
            );
          })
        );
      })
      .catch(() => res.status(400).send({
        message: 'An error occured.',
      }));
  }
  /**
   * List all users
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   *@returns {void}
   * @memberOf UsersController
   */
  static listUsers(req, res) {
    const query = {};
    query.limit = (req.query.limit > 0) ? req.query.limit : 5;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    User
      .findAndCountAll(query)
      .then((users) => {
        const pagination = Helper.pagination(
          query.limit, query.offset, users.count
        );
        res.status(200).send({
          pagination, users: users.rows,
        });
      });
  }
}

module.exports = usersController;
