const {GoogleGenAI} = require("@google/genai");
const {z}=require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema");

const ai= new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the candidate and the job description, ranging from 0 to 100"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind the technical question"),
        answer: z.string().describe("How to answer for the technical question, what points to cover, what approach to take etc."),
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind the behavioral question"),
        answer: z.string().describe("How to answer for the behavioral question, what points to cover, what approach to take etc."),
    })),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which is lacking in the candidate"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap"),
        type: z.string().describe("The type of the skill gap, can be technical, behavioral, soft skill etc."),
    })),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan"),
        focus: z.string().describe("The focus of the preparation plan for the day"),
        tasks: z.array(z.string()).describe("The tasks to be done for the preparation plan for the day"),
    }))
});

async function generateInterviewReport({resume,selfDescription, jobDescription}) {

    const prompt=`Generate an interview report for a candidate based on the following information:
            Job Description: ${jobDescription}
            Resume Text: ${resume}
            Self Description: ${selfDescription}`



    const response =await ai.models.generateContent({
       model: "Gemini 3.1 Flash-Lite",
       contents:prompt,
       config:{
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
       } 
    })

    return JSON.parse(response.text)
}

module.exports = generateInterviewReport;