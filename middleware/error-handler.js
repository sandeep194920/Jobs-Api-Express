const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, try again later',
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message, more: 'coming from line 5 ' })
  // }

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue).join(', ')} field. Please choose another value`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.name === 'CastError') {
    customError.message = `No item found with id ${err.value._id}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err, more: 'Mongoose error' })
  return res.status(customError.statusCode).json({ msg: customError.message, more: 'Mongoose error' })
}

module.exports = errorHandlerMiddleware

// duplicate error - if we are creating the same email again (we are currently throwing 500 error)
// not found error - if we update or delete or get the job that doesn't exist
// syntax error or any kind of mongoose error - final error
