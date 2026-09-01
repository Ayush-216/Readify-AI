const mongoose = require('mongoose');

/**
 * Job description : string
 * resume text : string
 * self description : string
 * 
 * matchScore : number
 * 
 * technical questions : 
 *      [{
 *      question: "",
 *      intention: "",
 *      expectedAnswer: "",
 *      }]
 * behavioral questions : []
 * skill gaps : 
 *      [{
 *      skill: "",
 *      severity: "",
 *      type: string,
 *      enum: ["low", "medium", "high"]
 *      }]
 * preparation plan:    
 *      [{
 *      day: number,
 *      focus: string,
 *      tasks: [string]
 *      }]
 */

const technicalQuestionSchema = new mongoose.Schema({
        question: {
            type: String,
            required: [true, "Question is required"]
        },
        intention: {
            type: String,
            required: [true, "Intention is required"]
        },
        expectedAnswer: {  
            type: String,
            required: [true, "Expected answer is required"]
        }
    }, {
        _id: false
    })

    const behavioralQuestionSchema = new mongoose.Schema({   question: {
            type: String,
            required: [true, "Question is required"]
        },
        intention: {
            type: String,
            required: [true, "Intention is required"]
        },
        expectedAnswer: {  
            type: String,
            required: [true, "Expected answer is required"]
        }
    },{
        _id: false
    })

    const skillGapSchema = new mongoose.Schema({
        skill: {
            type: String,
            required: [true, "Skill is required"]
        },
        severity: {
            type: String,
            required: [true, "Severity is required"],
            enum: ["low", "medium", "high"]
        }
    },{
            _id: false
        })

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]
},{
    _id: false
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },

    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],

    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema]
},{
    timestamps: true
})

// further we can do add metedata that which model we used to create the report but keeping it now for future improvements

const interviewReportModel = mongoose.model('interviewReports', interviewReportSchema);

module.exports = interviewReportModel;