import db from '../models';
// import ControllerHelper from '../helpers/ControllerHelper';

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
   * Login a user
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {number} status - Status code
   * @memberOf UsersController
   */
  // static login(req, res) {
  //   const query = {
  //     where: { email: req.body.email },
  //   };
  //   User.findOne(query)
  //     .then((user) => {
  //       if (!req.body.password) {
  //         return res.status(200)
  //           .send({ message: 'Invalid login credentials. Try again!' });
  //       }
  //       if (user && user.validatePassword(req.body.password)) {
  //         const token = jwt
  //           .sign({
  //             userId: user.id,
  //             roleType: user.roleType,
  //             user: user.name,
  //             email: user.email,
  //           },
  //           secret, { expiresIn: '12 hours' });
  //         return res.status(200).send({
  //           token,
  //           userId: user.id,
  //           roleType: user.roleType,
  //         });
  //       }
  //       res.status(200)
  //         .send({ message: 'Invalid login credentials. Try again!' });
  //     });
  // }

  // /**
  //  * Logout a user
  //  *
  //  * @static
  //  * @param {Object} req - Request object
  //  * @param {Object} res - Response object
  //  * @returns {number} status - Status code
  //  * @memberOf UsersController
  //  */
  // static logout(req, res) {
  //   res.status(200)
  //     .send({ message: 'Successfully logged out!' });
  // }


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
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            roleType: 'user',
          })
            .then((user) => {
              const token = jwt
                .sign({ userId: user.id,
                  roleType: user.roleType,
                  user: user.name,
                  email: user.email, },
                secret, { expiresIn: '12 hours' });
              res.status(201).send({ token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  roleType: user.roleType,
                  roleTitle: 'regular',
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
}

export default usersController;