const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


/*
|--------------------------------------------------------------------------
| Interview Report Schema
|--------------------------------------------------------------------------
*/

const interviewReportSchema = z.object({

    title: z.string(),

    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"]),
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()),
        })
    ),
});


/*
|--------------------------------------------------------------------------
| Gemini Response Schema
|--------------------------------------------------------------------------
*/

const interviewReportJsonSchema = {

    type: "object",

    properties: {

        title: {
            type: "string",
            description:
                "The title of the job for which the interview report is generated",
        },

        matchScore: {
            type: "number",
            description:
                "A score between 0 and 100 indicating how well the candidate matches the job description",
        },

        technicalQuestions: {
            type: "array",
            description:
                "Technical interview questions based on the job description and candidate profile",

            items: {

                type: "object",

                properties: {

                    question: {
                        type: "string",
                        description:
                            "A technical question that can be asked in the interview",
                    },

                    intention: {
                        type: "string",
                        description:
                            "The intention of the interviewer behind asking this question",
                    },

                    answer: {
                        type: "string",
                        description:
                            "How the candidate should answer this question",
                    },
                },

                required: [
                    "question",
                    "intention",
                    "answer",
                ],
            },
        },

        behavioralQuestions: {
            type: "array",
            description:
                "Behavioral interview questions based on the candidate profile and job requirements",

            items: {

                type: "object",

                properties: {

                    question: {
                        type: "string",
                        description:
                            "A behavioral question that can be asked in the interview",
                    },

                    intention: {
                        type: "string",
                        description:
                            "The intention of the interviewer behind asking this question",
                    },

                    answer: {
                        type: "string",
                        description:
                            "How the candidate should answer this question",
                    },
                },

                required: [
                    "question",
                    "intention",
                    "answer",
                ],
            },
        },

        skillGaps: {
            type: "array",
            description:
                "Skills that the candidate needs to improve for the target job",

            items: {

                type: "object",

                properties: {

                    skill: {
                        type: "string",
                        description:
                            "The skill that the candidate needs to improve",
                    },

                    severity: {
                        type: "string",
                        enum: [
                            "low",
                            "medium",
                            "high",
                        ],
                        description:
                            "The severity of the skill gap",
                    },
                },

                required: [
                    "skill",
                    "severity",
                ],
            },
        },

        preparationPlan: {
            type: "array",
            description:
                "A day-wise preparation plan for the candidate",

            items: {

                type: "object",

                properties: {

                    day: {
                        type: "number",
                        description:
                            "The day number of the preparation plan",
                    },

                    focus: {
                        type: "string",
                        description:
                            "The main focus for this day",
                    },

                    tasks: {
                        type: "array",

                        items: {
                            type: "string",
                        },

                        description:
                            "Tasks that the candidate should complete on this day",
                    },
                },

                required: [
                    "day",
                    "focus",
                    "tasks",
                ],
            },
        },
    },

    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ],
};


/*
|--------------------------------------------------------------------------
| Generate Interview Report
|--------------------------------------------------------------------------
*/

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {

    const prompt = `
Generate an interview preparation report for the candidate based on
the job description, resume, and self description provided below.

Evaluate the candidate's suitability for the role, generate relevant
technical and behavioral interview questions, identify skill gaps,
and create a practical preparation plan.

Base the report on the actual information provided. Do not invent
skills, experience, projects, or qualifications that are not present
in the resume.

Job Description:
${jobDescription}

Resume:
${resume}

Self Description:
${selfDescription}
`;


    const response = await ai.models.generateContent({

        model: "gemini-3.1-flash-lite",

        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportJsonSchema,
        },
    });


    const parsedResponse = JSON.parse(response.text);

    const validatedResponse =
        interviewReportSchema.parse(parsedResponse);

    return validatedResponse;
}


/*
|--------------------------------------------------------------------------
| Generate PDF From HTML
|--------------------------------------------------------------------------
*/

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setContent(
        htmlContent,
        {
            waitUntil: 'networkidle0'
        }
    );

    const pdfBuffer = await page.pdf({
        format: 'A4', margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
    });

    await browser.close();

    return pdfBuffer;
}


/*
|--------------------------------------------------------------------------
| Generate Resume PDF
|--------------------------------------------------------------------------
*/

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumepdfSchema = z.object({

        html: z.string().describe(
            "The HTML content of the resume PDF generated based on the provided resume, self description, and job description."
        )

    });


    const prompt = `
Generate a professional resume based on the provided resume,
self description, and job description.

It should be well-structured, visually appealing, and suitable
for submission to potential employers.

Ensure that the content is accurate and reflects the candidate's
qualifications and experience as described in the provided information.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

The response should be a JSON object with a single field "html"
which contains the HTML content of the resume PDF.

The HTML should be well-structured and formatted for easy
conversion to PDF.
`;


    const response = await ai.models.generateContent({

        model: "gemini-3.1-flash-lite",

        contents: prompt,

        config: {
            responseMimeType: "application/json",

            responseSchema:
                zodToJsonSchema(resumepdfSchema)
        }

    });


    const jsonContent = JSON.parse(response.text);

    const pdfBuffer = await generatePdfFromHtml(
        jsonContent.html
    );

    return pdfBuffer;
}


/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
    generateInterviewReport,
    generateResumePdf
};