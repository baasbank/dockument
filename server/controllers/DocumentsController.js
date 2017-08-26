import models from '../models';
import Helper from '../helper/Helper';

const Document = models.Document;

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
    if (!req.body.title) {
      return res.status(400).send({
        message: 'Title field is required.'
      });
    }
    if (!req.body.content) {
      return res.status(400).send({
        message: 'Content field is required.'
      });
    }
    if (!req.body.accessType) {
      return res.status(400).send({
        message: 'accessType field is required.'
      });
    }
    const checkAccessType = Helper.checkAccessType(req.body.accessType);
    if (checkAccessType === true) {
      Document
        .create({
          title: req.body.title,
          content: req.body.content,
          accessType: req.body.accessType,
          userId: req.decoded.userId,
        })
        .then(document => res.status(201).send({
          message: 'Document created.',
          document: {
            id: document.id,
            title: document.title,
            content: document.content,
            accessType: document.accessType,
            userId: document.userId
          }
        }))
        .catch(() => {
          return res.status(500).send({
            message: 'Error. Please try again.'
          });
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
  static fetchAllDocuments(req, res) {
    if ((!req.query.limit) && (!req.query.offset)) {
      Document.findAll()
        .then((documents) => {
          if (!documents) {
            return res.status(404).send({
              message: 'No documents found.'
            });
          }
          if (req.decoded.roleType === 'admin') {
            return res.status(200).send(
              {
                documents:
                documents.map((document) => {
                  return (
                    {
                      id: document.id,
                      title: document.title,
                      content: document.content,
                      accessType: document.accessType,
                      userId: document.userId,
                    }
                  );
                })
              });
          }
          return res.status(200).send({
            documents:
            documents.filter((document) => {
              return document.accessType === 'public';
            })
          });
        })
        .catch(() => res.status(500).send({
          message: 'Error. Please try again.',
        }));
    } else {
      const query = {};
      query.limit = req.query.limit;
      query.offset = req.query.offset || 0;
      Document
        .findAndCountAll(query)
        .then((documents) => {
          const pagination = Helper.paginate(
            query.limit, query.offset, documents.count
          );
          if (req.decoded.roleType === 'admin') {
            return res.status(200).send({
              pagination, documents: documents.rows,
            });
          }
          return res.status(200).send({
            pagination,
            documents:
            documents.rows.filter((document) => {
              return document.accessType === 'public';
            })
          });
        })
        .catch(() => {
          return res.status(500).send({
            message: 'Error. Please try again.'
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
  static fetchDocumentById(req, res) {
    return Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document does not exist.'
          });
        }
        if ((req.decoded.roleType !== 'admin') && (document.accessType === 'private') &&
          (document.userId !== req.decoded.userId)) {
          return res.status(403)
            .send({
              message: 'Private document.',
            });
        }
        return res.status(200).send({
          id: document.id,
          title: document.title,
          content: document.content,
          accessType: document.accessType,
          userId: document.userId,
        });
      })
      .catch(() => {
        res.status(500).send({ message: 'Error. Please try again.' });
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
  static updateDocumentById(req, res) {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document does not exist.',
          });
        }
        if (req.decoded.userId !== document.userId) {
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
        document
          .update({
            title: req.body.title || document.title,
            content: req.body.content || document.content,
            accessType: req.body.accessType || document.accessType,
            userId: document.userId,
          })
          .then(updatedDocument => res.status(200).send({
            message: 'Update Successful!',
            document: {
              id: updatedDocument.id,
              title: updatedDocument.title,
              content: updatedDocument.content,
              accessType: updatedDocument.accessType,
              userId: updatedDocument.userId
            }
          }))
          .catch(() => res.status(500).send({
            message: 'Error. Please try again.',
          }));
      })
      .catch(() => res.status(500).send({
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
  static deleteDocumentById(req, res) {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document does not exist.',
          });
        }

        if (req.decoded.userId !== document.userId) {
          return res.status(403).send({
            message: 'You can delete only your documents.'
          });
        }
        document
          .destroy()
          .then(() => res.status(200).send({
            message: 'Document deleted successfully.',
          }));
      })
      .catch(() => res.status(500).send({
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
  static searchForDocuments(req, res) {
    const searchTerm = req.query.q.trim();

    const query = {
      where: {
        title: {
          $iLike: `%${searchTerm}%`,
        },
      },
    };

    query.limit = (req.query.limit > 0) ? req.query.limit : 5;
    query.offset = (req.query.offset > 0) ? req.query.offset : 0;
    Document
      .findAndCountAll(query)
      .then((documents) => {
        const pagination = Helper.paginate(
          query.limit, query.offset, documents.count
        );
        if (!documents.rows.length) {
          return res.status(200).send({
            message: 'Search term does not match any document',
          });
        }
        if (req.decoded.roleType === 'admin') {
          return res.status(200).send({
            pagination,
            documents: documents.rows.map(document => (
              {
                id: document.id,
                title: document.title,
                content: document.content,
                accessType: document.accessType,
                userId: document.userId
              }
            ))
          });
        }
        return res.status(200).send({
          pagination,
          documents:
          documents.rows.filter((document) => {
            return document.accessType === 'public';
          })
        });
      });
  }
}

export default DocumentsController;
