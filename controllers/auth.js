const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = await user.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  })
}

const login = async (req, res) => {
  // get the user and send it back as json.
  // check if req has username and password. Check the user exists in DB? If not send the bad request error, else send user
  // hash pass and compare to the user's pass in db. If yes then send him the token (he has logged in now)

  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email }).exec()
  // compare password

  if (!user) {
    throw new UnauthenticatedError('Invalid  credentials')
  }

  console.log(password)
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid  credentials')
  }

  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  })
}

module.exports = { register, login }
