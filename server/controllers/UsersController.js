import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models';
import Helper from '../helper/Helper';

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
    req.checkBody('fullName', 'fullName field is required.').notEmpty();
    req.checkBody('email', 'email field is required.').notEmpty();
    req.checkBody('email', 'Please enter a valid email.').isEmail();
    req.checkBody('password', 'password field is required.').notEmpty();
    Helper.validateErrors(req, res);
    if (typeof req.body.fullName !== 'string') {
      return res.status(400).send({
        message: 'fullName cannot be a number.'
      });
    }

    User.findOne({ where: { email: req.body.email } })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(409).send({
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
              fullName: user.fullName,
              email: user.email,
              roleType: user.roleType,
            }
          }))
          .catch(() => res.status(500).send({
            message: 'Error. Please try again.',
          }));
      }).catch(() => {
        res.status(500).send({
          message: 'Error. Please try again.'
        });
      });
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
    req.checkBody('email', 'email field is required.').notEmpty();
    req.checkBody('password', 'password field is required.').notEmpty();
    req.checkBody('email', 'Please enter a valid email.').isEmail();
    Helper.validateErrors(req, res);
    if (typeof req.body.password !== 'string') {
      return res.status(400).send({
        message: 'password should be a string of letters and/or numbers.'
      });
    }

    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'Cannot find user.'
          });
        }
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
          const userData = {
            userId: user.id,
            fullName: user.fullName,
            roleType: user.roleType,
          };

          const token = jwt.sign(userData, secret, {
            expiresIn: '48h'
          });
          return res.status(200).json({
            token
          });
        } else {
          return res.status(401)
            .send({ message: 'Password mismatch.' });
        }
      })
      .catch(() => res.status(500).send({ message: 'Error. Please try again.' }));
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
  static fetchAllUsers(req, res) {
    if ((!req.query.limit) && (!req.query.offset)) {
      User.findAll()
        .then((users) => {
          if (!users) {
            return res.status(200).send({
              message: 'No user.'
            });
          }
          return res.status(200).send(
            {
              users:
              users.map(user => (
                {
                  id: user.id,
                  fullName: user.fullName,
                  email: user.email,
                  roleType: user.roleType,
                }
              ))
            });
        })
        .catch(() => res.status(500).send({
          message: 'Error. Please try again.',
        }));
    } else {
      const query = {};
      query.limit = req.query.limit;
      query.offset = req.query.offset || 0;
      User
        .findAndCountAll(query)
        .then((users) => {
          const pagination = Helper.paginate(
            query.limit, query.offset, users.count
          );
          return res.status(200).send({
            pagination,
            users: users.rows.map(user => (
              {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                roleType: user.roleType,
              }
            ))
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
  static fetchUserById(req, res) {
    req.checkParams('id', 'Please input a valid id.').isInt();
    Helper.validateErrors(req, res);
    User
      .findById(req.params.id)
      .then((user) => {
        Helper.userExists(user, res);
        if (req.decoded.userId === parseInt(req.params.id, 10)) {
          return res.status(200).send({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            roleType: user.roleType
          });
        }
        return res.status(200).send({
          fullName: user.fullName,
          roleType: user.roleType,
        });
      })
      .catch(() => {
        res.status(400).send({ message: 'Error. Please check the id and try again.' });
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
  static updateUserById(req, res) {
    req.checkParams('id', 'Please input a valid id.').isInt();
    Helper.validateErrors(req, res);
    Role.findOne({ where: { roleType: req.decoded.roleType } })
      .then((role) => {
        User
          .findById(req.params.id)
          .then((user) => {
            Helper.userExists(user, res);
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
            if (req.body.email) {
              req.checkBody('email', 'Please enter a valid email').isEmail();
              Helper.validateErrors(req, res);
            }
            user
              .update(req.body)
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
  static deleteUserById(req, res) {
    req.checkParams('id', 'Please input a valid id.').isInt();
    Helper.validateErrors(req, res);
    User
      .findById(req.params.id)
      .then((user) => {
        Helper.userExists(user, res);
        user
          .destroy()
          .then(() => res.status(200).send({
            message: 'User deleted successfully.',
          }));
      })
      .catch(() => res.status(500).send(
        'Error. Please try again.',
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
  static searchForUsers(req, res) {
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
        const pagination = Helper.paginate(
          query.limit, query.offset, users.count
        );
        if (!users.rows.length) {
          return res.status(404).send({
            message: 'Search term does not match any user.',
          });
        } else {
          res.status(200).send({
            pagination,
            users: users.rows.map(user => (
              {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                roleType: user.roleType,
              }
            ))
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
  static fetchAllDocumentsOfAUser(req, res) {
    req.checkParams('id', 'Please input a valid id.').isInt();
    Helper.validateErrors(req, res);
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
              accessType: document.accessType,
              userId: document.userId,
              createdAt: document.createdAt,
              updatedAt: document.updatedAt,
            }));

          const pagination = Helper.paginate(
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
