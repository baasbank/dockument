/**
 * helper class for controllers
 *
 * @class Helper
 */
class Helper {
  /**
   * @static
   * @param {integer} limit - max no. per page
   * @param {integer} offset - no. to offset by
   * @param {integer} count - total no. of records
   * @returns {Object} - returns pagination result
   * @memberOf Helper
   */
  static paginate(limit, offset, count) {
    /** totalCount : total number of records based on query
     * pageCount : total number of pages
     * currentPage : current page of the query result based on limit and offset
     * pageSize : number of records per page (based on limit)
     */
    const result = {};
    limit = limit > count ? count : limit;
    offset = offset > count ? count : offset;
    result.totalCount = count;
    result.currentPage = Math.floor(offset / limit) + 1;
    result.pageCount = Math.ceil(count / limit);
    result.pageSize = Number(limit);
    if (result.currentPage === result.pageCount && offset !== 0) {
      result.pageSize = result.totalCount % offset === 0 ?
        result.totalCount - offset : result.totalCount % offset;
      result.pageSize = Number(result.pageSize);
    }
    return result;
  }

  /**
   * @static
   * @param {string} accessType - document access type
   * @returns {boolean} - 
   * @memberOf Helper
   */
  static checkAccessType(accessType) {
    if ((accessType === 'public') || (accessType === 'private') || (accessType === 'role')) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @static
   * @param {object} document - document details
   * @param {object} res - response
   * @returns {object} message - 
   * @memberOf Helper
   */
  static documentExists(document, res) {
    if (!document) {
      return res.status(404).send({
        message: 'Document does not exist.'
      });
    }
  }

  /**
   * @static
   * @param {object} user - user details
   * @param {object} res - response
   * @returns {object} message - 
   * @memberOf Helper
   */
  static userExists(user, res) {
    if (!user) {
      return res.status(404).send({
        message: 'User does not exist.'
      });
    }
  }

  /**
   * @static
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} message - 
   * @memberOf Helper
   */
  static validateErrors(req, res) {
    const errors = req.validationErrors();
    if (errors) {
      const errorObject = errors.map(error => error.msg);
      if (errorObject.length === 1) {
        return res.status(400).send({
          message: errorObject[0],
        });
      }
      return res.status(400).send({
        message: errorObject,
      });
    }
  }
}

export default Helper;
