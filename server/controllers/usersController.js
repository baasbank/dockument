const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const db = require('../models');
const Helper = require('../helper/Helper');

const secret = process.env.SECRET;
const Role = db.Role;
const User = db.User;
const Document = db.Document;


/**
 * usersController class to create and manage users
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
   * @returns {void}
   * @memberOf usersController
   */
  static createUser(req, res) {
    if (req.body.name &&
        req.body.email &&
        req.body.password) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        User.findOne({ where: { email: req.body.email } })
          .then((existingUser) => {
            if (existingUser) {
              res.status(200).send({
                message: 'User already exists!',
              });
            } else {
              User.create({
                fullName: req.body.name,
                email: req.body.email,
                password: hash,
                roleType: 'regular user'
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
                  message: 'Error. Please try again.',
                }));
            }
          }).catch((error) => {
            res.status(400).json(error);
          });
      });
    } else {
      return res.status(200).send({
        message: 'All fields are required.'
      });
    }
  }

  /**
   * Login a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {void}
   * @memberOf usersController
   */
  static login(req, res) {
    if (!(req.body.password) && !(req.body.email)) {
      res.status(400)
        .json({ message: 'All fields are required' });
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
              if (err) throw err;
              if (result) {
                const userData = {
                  userId: user.id,
                  fullName: user.fullName,
                  roleType: user.roleType,
                };

                const token = jwt.sign(userData, secret, {
                  expiresIn: '48h'
                });
                res.status(201).json({
                  userData,
                  token
                });
              } else {
                res.status(401).json({
                  message: 'Wrong password'
                });
              }
            });
          } else {
            res.status(400)
              .send({ message: 'Invalid login credentials. Try again.' });
          }
        });
    }
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
   * @memberOf usersController
   */
  static getAllUsers(req, res) {
    if ((!req.query.limit) && (!req.query.offset)) {
      User.findAll()
        .then((users) => {
          res.status(200).send(
            users.map(user => (
              {
                name: user.fullName,
                email: user.email,
                roleType: user.roleType,
              }
            ))
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
   * @returns {object} json - payload
   * @memberOf usersController
   */
  static updateUser(req, res) {
    Role.findOne({ where: { roleType: req.decoded.roleType } })
      .then((role) => {
        User
          .findById(req.params.id)
          .then((user) => {
            if (!user) {
              return res.status(404).send({
                message: 'No such user.',
              });
            }
            if (req.body.id) {
              return res.status(403).send({
                message:
                'User ID cannot be updated.',
              });
            }

            if ((role.roleType !== 'admin') && (req.body.roleType)) {
              return res.status(403).send({
                message:
                'You do not have permission to update this property.',
              });
            }

            if ((role.roleType !== 'admin') && (req.decoded.userId !== user.id)) {
              return res.status(403).send({
                message:
                'You do not have permission to update this property.',
              });
            }
            user
              .update({
                fullName: req.body.name || user.fullName,
                email: req.body.email || user.email,
                password: req.body.password || user.password,
                roleType: req.body.roleType || user.roleType,
              })
              .then(() => res.status(200).send({
                message: 'Update Successful!',
                user,
              }))
              .catch(() => res.status(400).send({
                message: 'Error. Please try again.',
              }));
          })
          .catch(() => res.status(400).send({
            message: 'Error. Please try again.',
          }));
      });
  }


  /**
    * Delete a user by id
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {object} json - payload
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
        message: 'Error. Please try again',
      }));
  }

  /**
   * search for users
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json- payload
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
  /**
   * Get all documents belonging to a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json - payload
   * @memberOf usersController
   */
  static getUserDocuments(req, res) {
    const query = {
      where: {
        $and: {
          UserId: { $eq: req.params.id },
          $or: {
            accessType: { $eq: 'public' || 'role' },
          },
        },
      }
    };
    query.limit = (req.query.limit > 0) ? req.query.limit : 5;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    Document
      .findAndCountAll(query)
      .then((documents) => {
        const mappedDocuments = documents.rows
          .map(document => ({
            id: document.id,
            title: document.title,
            content: document.content,
            access: document.accessType,
            OwnerId: document.UserId,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
          }));

        const pagination = Helper.pagination(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(200).send({
            message: 'No document matches the request.',
          });
        }
        res.status(200).send({
          pagination, documents: mappedDocuments,
        });
      })
      .catch(() => res.status(400).send({
        message: 'Error. Please try again.',
      }));
  }
}

module.exports = usersController;
