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

/**
 * route get /api/interview/report/:interviewId
 * @desc  This route is used to get the interview report based on the provided interviewId.
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview
 * @desc  This route is used to get all the interview reports of the logged in user.
 * @access private
 */
 
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController); 

/**
 * @route POST /api/interview/resume/pdf
 * @desc  This route is used to generate a PDF of the resume based on the provided interviewReportId.
 * @access private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);


module.exports = interviewRouter;