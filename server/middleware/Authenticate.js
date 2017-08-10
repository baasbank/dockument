import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;


/**
   * Verify a token
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {object} next - next function to call
   * @returns {object} message - verification status
   */

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'Could not authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({
      status: 'Failed',
      message: 'No token provided.'
    });
  }
};

/**
   * Check for admin
   * @static
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {object} next - next function to call
   * @returns {object} message - authorization status
   */

const hasAdminAccess = (req, res, next) => {
  if (req.decoded.roleType === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: 'Only an admin can access this resource.',
    });
  }
};

export default {
  verifyToken,
  hasAdminAccess
};
