/**
 * helper class for controllers
 *
 * @class helper
 */
class helper {
  /**
   * @static
   * @param {integer} limit - max no. per page
   * @param {integer} offset - no. to offset by
   * @param {integer} count - total no. of records
   * @returns {Object} - returns pagination result
   * @memberOf helper
   */
  static pagination(limit, offset, count) {
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
}

module.exports = helper;
