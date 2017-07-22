const db = require('../models');

const Document = db.Document;

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
        req.body.accessType &&
        req.body.userId) {
      Document
        .create({
          title: req.body.title,
          content: req.body.content,
          accessType: req.body.access,
          UserId: req.body.userId,
        })
        .then(document => res.status(201).send(document))
        .catch(() => res.status(400).send({
          message: 'An error occured. Please try again!',
        }));
    } else {
      return res.status(206).send({
        message: 'All fields are required.'
      });
    }
  }
}

module.exports = documentsController;
