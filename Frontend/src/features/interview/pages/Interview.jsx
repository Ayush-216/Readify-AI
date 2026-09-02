import React, { useState } from "react";
import "../style/interview.scss";

const technicalQuestions = [
    {
        question: "What is the difference between SQL and NoSQL databases?",
        intention:
            "Evaluate your understanding of database technologies and when to choose one over the other.",
        answer:
            "SQL databases are relational and use structured schemas with tables and relationships. NoSQL databases are generally more flexible and can store document, key-value, graph, or column-based data. SQL is often preferred when strong relationships and transactions are important, while NoSQL can be useful for flexible schemas and highly scalable applications.",
    },
    {
        question: "Explain how you would design a REST API for a user management system.",
        intention:
            "Assess your understanding of REST principles, API design, and backend architecture.",
        answer:
            "I would define resources such as users and expose RESTful endpoints like GET /users, GET /users/:id, POST /users, PUT /users/:id, and DELETE /users/:id. I would also implement authentication, authorization, validation, proper HTTP status codes, pagination, and consistent error responses.",
    },
    {
        question: "What happens when a React component re-renders?",
        intention:
            "Test your understanding of React's rendering model and component lifecycle.",
        answer:
            "When state or props change, React schedules a re-render. React creates a new virtual representation of the UI, compares it with the previous one, and updates only the necessary parts of the actual DOM.",
    },
    {
        question: "What is middleware in Express.js?",
        intention:
            "Evaluate your practical understanding of Express backend architecture.",
        answer:
            "Middleware functions execute during the request-response cycle. They can inspect or modify the request and response objects, perform authentication or validation, log requests, and either send a response or pass control to the next middleware using next().",
    },
];

const behavioralQuestions = [
    {
        question: "Tell me about a challenging project you worked on.",
        intention:
            "Understand how you approach difficult problems and handle challenges.",
        answer:
            "I would explain the project context, the specific challenge, the actions I personally took, and the measurable result. I would structure the response using the STAR method.",
    },
    {
        question: "How do you handle disagreements with a teammate?",
        intention:
            "Evaluate communication, collaboration, and conflict-resolution skills.",
        answer:
            "I try to understand the other person's perspective first, then discuss the technical or business reasoning behind both approaches. I focus on the project goal rather than making the discussion personal.",
    },
    {
        question: "Where do you see yourself in the next three years?",
        intention:
            "Understand your career direction and alignment with the role.",
        answer:
            "I would like to become a stronger full-stack engineer, take ownership of larger features, improve my system-design skills, and contribute to architectural decisions.",
    },
];

const preparationPlan = [
    {
        day: 1,
        focus: "Strengthen Core JavaScript & React",
        tasks: [
            "Review JavaScript fundamentals, closures, promises, and async/await.",
            "Revise React hooks, state management, and component lifecycle.",
            "Build a small React feature without following a tutorial.",
        ],
    },
    {
        day: 2,
        focus: "Backend & API Development",
        tasks: [
            "Review Express.js middleware and routing.",
            "Practice designing REST APIs.",
            "Revise authentication, authorization, and error handling.",
        ],
    },
    {
        day: 3,
        focus: "Database & System Design",
        tasks: [
            "Review MongoDB schema design and indexing.",
            "Practice SQL joins and query optimization.",
            "Design a simple scalable web application.",
        ],
    },
    {
        day: 4,
        focus: "Interview Practice",
        tasks: [
            "Practice answering technical questions aloud.",
            "Prepare STAR-based behavioral answers.",
            "Complete one mock interview under time pressure.",
        ],
    },
];

const skillGaps = [
    {
        skill: "System Design",
        severity: "high",
    },
    {
        skill: "SQL",
        severity: "medium",
    },
    {
        skill: "Testing",
        severity: "medium",
    },
    {
        skill: "Communication",
        severity: "low",
    },
];

const Interview = () => {
    const [activeSection, setActiveSection] = useState("technical");
    const [openQuestion, setOpenQuestion] = useState(0);

    const questions =
        activeSection === "technical"
            ? technicalQuestions
            : behavioralQuestions;

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setOpenQuestion(0);
    };

    return (
        <div className="interview-page">

            <div className="interview-layout">

                {/* ───────────────── LEFT NAV ───────────────── */}
                <aside className="interview-nav">

                    <div>

                        <div className="interview-nav__label">
                            Interview Plan
                        </div>

                        <button
                            className={`interview-nav__item ${
                                activeSection === "technical"
                                    ? "interview-nav__item--active"
                                    : ""
                            }`}
                            onClick={() => handleSectionChange("technical")}
                        >
                            <span className="interview-nav__icon">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            </span>

                            Technical
                        </button>


                        <button
                            className={`interview-nav__item ${
                                activeSection === "behavioral"
                                    ? "interview-nav__item--active"
                                    : ""
                            }`}
                            onClick={() => handleSectionChange("behavioral")}
                        >
                            <span className="interview-nav__icon">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>

                            Behavioral
                        </button>


                        <button
                            className={`interview-nav__item ${
                                activeSection === "roadmap"
                                    ? "interview-nav__item--active"
                                    : ""
                            }`}
                            onClick={() => handleSectionChange("roadmap")}
                        >
                            <span className="interview-nav__icon">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.01A1.65 1.65 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15z" />
                                </svg>
                            </span>

                            Roadmap
                        </button>

                    </div>


                    <button className="interview-nav__item">
                        <span className="interview-nav__icon">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                        </span>

                        Back to Home
                    </button>

                </aside>


                <div className="interview-divider" />


                {/* ───────────────── CENTER CONTENT ───────────────── */}
                <main className="interview-content">

                    {activeSection !== "roadmap" ? (

                        <section>

                            <div className="content-header">

                                <h2>
                                    {activeSection === "technical"
                                        ? "Technical Questions"
                                        : "Behavioral Questions"}
                                </h2>

                                <span className="content-header__count">
                                    {questions.length} Questions
                                </span>

                            </div>


                            <div className="q-list">

                                {questions.map((item, index) => {

                                    const isOpen = openQuestion === index;

                                    return (
                                        <div
                                            className="q-card"
                                            key={index}
                                        >

                                            <div
                                                className="q-card__header"
                                                onClick={() =>
                                                    setOpenQuestion(
                                                        isOpen
                                                            ? null
                                                            : index
                                                    )
                                                }
                                            >

                                                <span className="q-card__index">
                                                    Q{index + 1}
                                                </span>

                                                <p className="q-card__question">
                                                    {item.question}
                                                </p>

                                                <span
                                                    className={`q-card__chevron ${
                                                        isOpen
                                                            ? "q-card__chevron--open"
                                                            : ""
                                                    }`}
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="6 9 12 15 18 9" />
                                                    </svg>
                                                </span>

                                            </div>


                                            {isOpen && (

                                                <div className="q-card__body">

                                                    <div className="q-card__section">

                                                        <span className="q-card__tag q-card__tag--intention">
                                                            Intention
                                                        </span>

                                                        <p>
                                                            {item.intention}
                                                        </p>

                                                    </div>


                                                    <div className="q-card__section">

                                                        <span className="q-card__tag q-card__tag--answer">
                                                            Expected Answer
                                                        </span>

                                                        <p>
                                                            {item.answer}
                                                        </p>

                                                    </div>

                                                </div>

                                            )}

                                        </div>
                                    );
                                })}

                            </div>

                        </section>

                    ) : (

                        <section>

                            <div className="content-header">

                                <h2>
                                    Preparation Roadmap
                                </h2>

                                <span className="content-header__count">
                                    4 Days
                                </span>

                            </div>


                            <div className="roadmap-list">

                                {preparationPlan.map((day) => (

                                    <div
                                        className="roadmap-day"
                                        key={day.day}
                                    >

                                        <div className="roadmap-day__header">

                                            <span className="roadmap-day__badge">
                                                Day {day.day}
                                            </span>

                                            <h3 className="roadmap-day__focus">
                                                {day.focus}
                                            </h3>

                                        </div>


                                        <ul className="roadmap-day__tasks">

                                            {day.tasks.map(
                                                (task, index) => (

                                                    <li key={index}>

                                                        <span className="roadmap-day__bullet" />

                                                        {task}

                                                    </li>

                                                )
                                            )}

                                        </ul>

                                    </div>

                                ))}

                            </div>

                        </section>

                    )}

                </main>


                <div className="interview-divider" />


                {/* ───────────────── RIGHT SIDEBAR ───────────────── */}
                <aside className="interview-sidebar">

                    {/* Match Score */}
                    <div className="match-score">

                        <p className="match-score__label">
                            Job Match Score
                        </p>

                        <div className="match-score__ring score--high">

                            <span className="match-score__value">
                                85
                            </span>

                            <span className="match-score__pct">
                                / 100
                            </span>

                        </div>

                        <p className="match-score__sub">
                            Strong Match
                        </p>

                    </div>


                    <div className="sidebar-divider" />


                    {/* Skill Gaps */}
                    <div className="skill-gaps">

                        <p className="skill-gaps__label">
                            Skill Gaps
                        </p>


                        <div className="skill-gaps__list">

                            {skillGaps.map((item) => (

                                <span
                                    className={`skill-tag skill-tag--${item.severity}`}
                                    key={item.skill}
                                >
                                    {item.skill}
                                </span>

                            ))}

                        </div>

                    </div>


                    <div className="sidebar-divider" />


                    {/* Job Information */}
                    <div className="skill-gaps">

                        <p className="skill-gaps__label">
                            Target Role
                        </p>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "0.9rem",
                                color: "#e6edf3",
                                lineHeight: 1.5,
                            }}
                        >
                            Full Stack Developer
                        </p>

                    </div>


                    <div className="sidebar-divider" />


                    <div className="skill-gaps">

                        <p className="skill-gaps__label">
                            Recommendation
                        </p>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "0.8rem",
                                color: "#7d8590",
                                lineHeight: 1.6,
                            }}
                        >
                            Focus on system design, SQL, and testing before
                            the interview.
                        </p>

                    </div>

                </aside>

            </div>

        </div>
    );
};

export default Interview;