const db = require('../models');
const Helper = require('../helper/Helper');

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

  /**
   * List all users
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   *@returns {void}
   * @memberOf UsersController
   */
  static getAllDocuments(req, res) {
    if ((!req.query.limit) && (!req.query.offset)) {
      Document.findAll()
        .then((documents) => {
          res.status(200).send(
            documents.map((document) => {
              return (
                {
                  title: document.title,
                  content: document.content,
                  access: document.accessType,
                  userId: document.UserId,
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
      Document
        .findAndCountAll(query)
        .then((documents) => {
          const pagination = Helper.pagination(
            query.limit, query.offset, documents.count
          );
          res.status(200).send({
            pagination, documents: documents.rows,
          });
        });
    }
  }

  /**
   * Find a document by ID
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   *@returns {void}
   * @memberOf DocumentsController
   */
  static findADocument(req, res) {
    return Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          throw new Error('Cannot find document.');
        }
        return res.status(200).send({
          documentId: document.id,
          title: document.title,
          content: document.content,
          access: document.accessType,
          ownerId: document.UserId,
        });
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        res.status(400).send(errorMessage);
      });
  }
}

module.exports = documentsController;
