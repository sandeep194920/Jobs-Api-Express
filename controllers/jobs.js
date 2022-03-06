const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const Job = require('../models/Job')

const getAllJobs = async (req, res) => {
  console.log('RACHED ALL JOBS')
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  const job = await Job.findById({ createdBy: userId, _id: jobId })
  res.status(StatusCodes.OK).json(job)
}
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.OK).json(job)
}
const updateJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
    body,
  } = req
  const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, body, { new: true })
  res.status(StatusCodes.OK).json(job)
}

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId })
  if (!job) {
    throw new NotFoundError(`The job with id ${jobId} not found`)
  }
  res.status(200).json({ success: true, data: { job } })
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
