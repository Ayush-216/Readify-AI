import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});


/**
 * description: This function is used to generate interview questions and answers
 * based on the provided job description, resume, and self description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};


/**
 * description: This function is used to fetch a single interview report
 * based on the provided interview report ID.
 */
export const getInterviewReportById = async (interviewId) => {

    const response = await api.get(`/api/interview/report/${interviewId}`);

    return response.data;
};


/**
 * description: This function is used to fetch all interview reports
 * associated with the authenticated user.
 */
export const getAllInterviewReports = async () => {

    const response = await api.get("/api/interview");

    return response.data;
};


/**
 * description: This function is used to generate a PDF of the resume
 * based on the provided interview report ID.
 */
export const generateResumePdf = async (interviewReportId) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: 'blob', // Important for handling binary data
    });

    return response.data;
};