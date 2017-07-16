import db from '../models';
// import ControllerHelper from '../helpers/ControllerHelper';

// const Role = db.Role;
const Document = db.Document;
// const User = db.User;

/**
 *
 * DocumentsController class to create and manage documents
 * @class DocumentsController
 */
class documentsController {
  /**
   * Create a new Document
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {void}
   * @memberOf DocumentsController
   */
  static createDocument(req, res) {
    if (req.body.title &&
        req.body.content &&
        req.body.accessType) {
      Document
        .create({
          title: req.body.title,
          content: req.body.content,
          accessType: req.body.access,
          UserId: req.decoded.userId,
        })
        .then(document => res.status(201).send(document))
        .catch(() => res.status(400).send({
          message: 'An error occured. Invalid parameters, try again!',
        }));
    } else {
      return res.status(206).send({
        message: 'All fields are required.'
      });
    }
  }
}

export default documentsController;
