import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models';
import helper from '../helper/Helper';

require('dotenv').config();

const secret = process.env.SECRET;
const Role = models.Role;
const User = models.User;
const Document = models.Document;

/**
 * UsersController class to create and manage users
 *
 * @class UsersController
 */
class UsersController {
  /**
     * Create a user
     * @static
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @returns {object} json - payload
     * @memberOf UsersController
     */
  static createUser(req, res) {
    if (req.body.fullName &&
      req.body.email &&
      req.body.password) {
      User.findOne({ where: { email: req.body.email } })
        .then((existingUser) => {
          if (existingUser) {
            res.status(400).send({
              message: 'User already exists!',
            });
          }
          User.create({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            roleType: 'regular user'
          })
            .then(user => res.status(201).send({
              message: 'signup successful',
              user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                roleType: user.roleType,
              }
            }))
            .catch(() => res.status(500).send({
              message: 'Error. Please try again.',
            }));
        }).catch((error) => {
          res.status(400).json(error);
        });
    } else {
      return res.status(206).send({
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
   * @returns {object} json - payload 
   * @memberOf UsersController
   */
  static login(req, res) {
    if (!(req.body.password) || !(req.body.email)) {
      res.status(400)
        .json({ message: 'All fields are required' });
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const userData = {
              userId: user.id,
              fullName: user.fullName,
              roleType: user.roleType,
            };

            const token = jwt.sign(userData, secret, {
              expiresIn: '48h'
            });
            res.status(200).json({
              token
            });
          } else {
            res.status(401)
              .send({ message: 'Invalid login credentials. Try again.' });
          }
        })
        .catch(error => res.status(400).send(error));
    }
  }
  /**
   * Get all users
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   *@returns {object} json - payload
   * @memberOf UsersController
   */
  static getAllUsers(req, res) {
    if ((!req.query.limit) && (!req.query.offset)) {
      User.findAll()
        .then((users) => {
          res.status(200).send(
            {
              allUsers:
              users.map(user => (
                {
                  name: user.fullName,
                  email: user.email,
                  roleType: user.roleType,
                }
              ))
            });
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
          const pagination = helper.paginate(
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
   *@returns {object} user - the user's details
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
   * @memberOf UsersController
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

            if (req.body.createdAt) {
              return res.status(403).send({
                message:
                'createdAt date cannot be changed.',
              });
            }

            if (req.body.updatedAt) {
              return res.status(403).send({
                message:
                'updatedAt date cannot be changed.',
              });
            }

            if ((role.roleType !== 'admin') && (req.body.roleType)) {
              return res.status(403).send({
                message:
                'You cannot update your role type.',
              });
            }

            if ((role.roleType !== 'admin') && (req.decoded.userId !== user.id)) {
              return res.status(403).send({
                message:
                'You can update only your profile.',
              });
            }
            user
              .update({
                fullName: req.body.fullName || user.fullName,
                email: req.body.email || user.email,
                password: req.body.password || user.password,
                roleType: req.body.roleType || user.roleType,
              })
              .then(updatedUser => res.status(200).send({
                message: 'Update Successful!',
                user: {
                  fullName: updatedUser.fullName,
                  email: updatedUser.email,
                  roleType: updatedUser.roleType,
                  userId: updatedUser.id
                }
              }));
          })
          .catch(() => res.status(500).send(
            'Error. Please try again.',
          ));
      });
  }


  /**
    * Delete a user by id
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {object} message - delete message
    * @memberOf UsersController
    */
  static deleteAUser(req, res) {
    User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User does not exist',
          });
        }
        user
          .destroy()
          .then(() => res.status(410).send({
            message: 'User deleted successfully.',
          }));
      })
      .catch(() => res.status(400).send(
        'Error. Please try again',
      ));
  }

  /**
   * search for users
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json- payload
   * @memberOf UsersController
   */
  static searchUsers(req, res) {
    const searchTerm = req.query.q.trim();

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

    query.limit = (req.query.limit > 0) ? req.query.limit : 2;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    query.order = ['createdAt'];
    User
      .findAndCountAll(query)
      .then((users) => {
        const pagination = helper.paginate(
          query.limit, query.offset, users.count
        );
        if (!users.rows.length) {
          return res.status(404).send({
            message: 'Search term does not match any user',
          });
        } else {
          res.status(200).send({
            pagination, users: users.rows,
          });
        }
      });
  }
  /**
   * Get all documents belonging to a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json - payload
   * @memberOf UsersController
   */
  static getUserDocuments(req, res) {
    if ((parseInt(req.params.id, 10) === req.decoded.userId) || (req.decoded.roleType === 'admin')) {
      const query = {
        where: {
          userId: { $eq: req.params.id },
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
              OwnerId: document.userId,
              createdAt: document.createdAt,
              updatedAt: document.updatedAt,
            }));

          const pagination = helper.paginate(
            query.limit, query.offset, documents.count
          );
          if (!documents.rows.length) {
            return res.status(404).send({
              message: 'This user does not have any document.',
            });
          }
          res.status(200).send({
            pagination, documents: mappedDocuments,
          });
        })
        .catch(() => res.status(400).send(
          'Error. Please check the id and try again'
        ));
    } else {
      return res.status(403).send({
        message: 'You cannot view another user documents.',
      });
    }
  }
}

export default UsersController;
