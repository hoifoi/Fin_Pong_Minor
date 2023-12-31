const jwt = require('jsonwebtoken');
const userDao = require('../models/userDao');
const error = require('./error');
const secretKey = process.env.TYPEORM_SECRET_KEY

const loginRequired = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.substr(7);
    if (!accessToken) {
      error.throwErr(401, 'NEEDED_ACCESS_TOKEN');
    }
    const payload = jwt.verify(accessToken, secretKey);
    const [ userInfo ] = await userDao.getUserInformationById( payload.id );
    if (!userInfo) {
      error.throwErr(404, 'USER_DOES_NOT_EXIST');
    }
    req.userData = userInfo;
    next();
  } catch(err) {
    res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'})
  }
}

module.exports = {
  loginRequired
}