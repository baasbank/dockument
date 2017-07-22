const db = require('../models');
const Helper = require('../helper/Helper');

const User = db.User;
// const Role = db.Role;
// const Document = db.Document;
// const secret = process.env.SECRET || 'mySecret';

/**
 * UsersController class to create and manage users
 *
 * @class usersController
 */
class usersController {
/**
   * Create a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {number} status - Status code
   * @memberOf usersController
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
   * @memberOf usersController
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
   * @memberOf usersController
   */
  static logout(req, res) {
    res.status(200)
      .send({ message: 'User logged out successfully' });
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
  static getAllUsers(req, res) {
    if ((!req.query.limit) && (!req.query.offset)) {
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
    } else {
      const query = {};
      query.limit = req.query.limit;
      query.offset = req.query.offset || 0;
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
  /**
   * Find a user by ID
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   *@returns {void}
   * @memberOf UsersController
   */
  static findAUser(req, res) {
    return User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          throw new Error('Cannot find user.');
        }
        return res.status(200).send({
          name: user.fullName,
          email: user.email,
          role: user.roleType,
        });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        res.status(400).send(errorMessage);
      });
  }

  /**
   * Update a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {void}
   * @memberOf UsersController
   */
  static updateUser(req, res) {
    User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User does not exist',
          });
        }
        user
          .update({
            fullName: req.body.name || user.fullName,
            email: req.body.email || user.email,
            password: req.body.password || user.password,
          })
          .then(() => res.status(200).send({
            message: 'Update Successful!',
            user,
          }))
          .catch(() => res.status(400).send({
            message: 'An error occured. Please try again!',
          }));
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Please try again!',
      }));
  }

  /**
    * Delete a user by id
    * Route: DELETE: /users/:id
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {void} no returns
    */
  static deleteAUser(req, res) {
    User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User does not exist',
          });
        }
        user
          .destroy()
          .then(() => res.status(200).send({
            message: 'User deleted successfully.',
          }));
      })
      .catch(() => res.status(400).send({
        message: 'An error occured. Please try again',
      }));
  }

  /**
   * Gets all users relevant to search query
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {string} - Returns response object
   *
   * @memberOf usersController
   */
  static searchUsers(req, res) {
    const searchTerm = req.query.search.trim();

    const query = {
      where: {
        $or: [{
          fullName: {
            $iLike: `%${searchTerm}%`,
          },
          email: {
            $iLike: `%${searchTerm}%`,
          },
        }],
      },
    };

    query.limit = (req.query.limit > 0) ? req.query.limit : 10;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = ['createdAt'];
    User
      .findAndCountAll(query)
      .then((users) => {
        const pagination = Helper.pagination(
          query.limit, query.offset, users.count
        );
        if (!users.rows.length) {
          return res.status(200).send({
            message: 'Search term does not match any user',
          });
        }
        res.status(200).send({
          pagination, users: users.rows,
        });
      });
  }
}

module.exports = usersController;
