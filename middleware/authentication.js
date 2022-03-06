// for accessing the jobs the user will provide the token
// we need to verify the token the user provides with the one in the db
// if both match then pass it to next middleware which is jobs api and user can access it
// if they're not matched then throw the bad request error

const { BadRequestError, UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const { userId, name } = payload
    req.user = { userId, name }
    next()
  } catch (err) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
