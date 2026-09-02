const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');

const interviewRouter = express.Router();

/**
 * @route post /api/interview
 * @desc  This route is used to generate interview questions and answers based on the provided job description and resume and self description.
 * @access private
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"),interviewController.generateInterviewReportController);

module.exports = interviewRouter;