import db from '../models';
import helper from '../helper/helper';

const Document = db.Document;

/**
 * class to create and manage documents
 * @class DocumentsController
 */
class DocumentsController {
  /**
   * create a new document
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json - payload
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
          accessType: req.body.accessType,
          UserId: req.body.userId,
        })
        .then(document => res.status(201).send({
          message: 'Document created.',
          details: {
            documentId: document.id,
            content: document.content,
            accessType: document.accessType,
            ownerId: document.UserId
          }
        }))
        .catch(() => res.status(400).send({
          message: 'Error. Please try again.',
        }));
    } else {
      return res.status(206).send({
        message: 'All fields are required.'
      });
    }
  }

  /**
   * get all documents
   *
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   *@returns {object} json - payload
   * @memberOf DocumentsController
   */
  static getAllDocuments(req, res) {
    if ((!req.query.limit) && (!req.query.offset)) {
      Document.findAll()
        .then((documents) => {
          res.status(200).send(
            {
              allDocuments:
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
            });
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
          const pagination = helper.pagination(
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
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   *@returns {object} json - payload
   * @memberOf DocumentsController
   */
  static findADocument(req, res) {
    return Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          throw new Error('Document does not exist.');
        }
        if (document.accessType === 'private' && req.decoded.userId !== req.params.id) {
          return res.status(403).send({
            message: 'You do not have access to this document'
          });
        }

        if (document.accessType === 'role' && (req.decoded.roleType !== 'super user' || req.decoded.roleType !== 'admin')) {
          return res.status(403).send({
            message: 'You do not have access to this document'
          });
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

  /**
   * update a document by id
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json - payload
   * @memberOf DocumentsController
   */
  static updateDocument(req, res) {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Cannot find document',
          });
        }
        if (req.decoded.userId !== document.UserId) {
          return res.status(403).send({
            message: 'You can update only your documents.'
          });
        }

        if (req.body.id) {
          return res.status(403).send({
            message:
            'Document ID cannot be changed.',
          });
        }

        if (req.body.UserId) {
          return res.status(403).send({
            message:
            'User ID cannot be changed.',
          });
        }
        document
          .update({
            title: req.body.title || document.title,
            content: req.body.content || document.content,
            access: req.body.accessType || document.accessType,
            userId: document.UserId,
          })
          .then(() => res.status(200).send({
            message: 'Update Successful!',
            document,
          }))
          .catch(() => res.status(400).send({
            message: 'Error. Please try again.',
          }));
      })
      .catch(() => res.status(400).send({
        message: 'Error. Please try again.',
      }));
  }

  /**
    * delete a document by id
    * @static 
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {object} json - payload
    * @memberOf DocumentsController
    */
  static deleteADocument(req, res) {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document does not exist.',
          });
        }

        if (req.decoded.userId !== document.UserId) {
          return res.status(403).send({
            message: 'You can delete only your documents.'
          });
        }
        document
          .destroy()
          .then(() => res.status(410).send({
            message: 'Document deleted successfully.',
          }));
      })
      .catch(() => res.status(400).send({
        message: 'Error. Please try again.',
      }));
  }

  /**
   * search documents
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {object} json - payload
   * @memberOf DocumentsController
   */
  static searchDocuments(req, res) {
    const searchTerm = req.query.search.trim();

    const query = {
      where: {
        $or: [{
          title: {
            $iLike: `%${searchTerm}%`,
          },
        }],
      },
    };

    query.limit = (req.query.limit > 0) ? req.query.limit : 5;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    Document
      .findAndCountAll(query)
      .then((documents) => {
        const pagination = helper.pagination(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(200).send({
            message: 'Search term does not match any document',
          });
        }
        res.status(200).send({
          pagination, documents: documents.rows,
        });
      });
  }
}

export default DocumentsController;
