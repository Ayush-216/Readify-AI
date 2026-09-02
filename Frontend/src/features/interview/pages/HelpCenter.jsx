import React from "react";
import { Link } from "react-router";
import "../style/info-pages.scss";

const HelpCenter = () => {
    return (
        <main className="info-page">
            <div className="info-page__container">

                <Link to="/" className="info-page__back">
                    ← Back to Readify-AI
                </Link>

                <header className="info-page__header">
                    <h1>Help Center</h1>
                    <p>Find answers to common questions about Readify-AI.</p>
                </header>

                <section className="info-page__content">

                    <h2>How does Readify-AI work?</h2>
                    <p>
                        Readify-AI analyzes your resume or self-description
                        together with a target job description and creates a
                        personalized interview preparation plan.
                    </p>

                    <h2>How do I generate an interview plan?</h2>
                    <p>
                        Go to the Home page, enter the target job description,
                        and provide either your resume or a self-description.
                        Then click the Generate My Interview Strategy button.
                    </p>

                    <h2>What can I upload?</h2>
                    <p>
                        You can upload a PDF or DOCX resume. You can also use
                        the self-description field if you do not have a resume
                        available.
                    </p>

                    <h2>What does the match score mean?</h2>
                    <p>
                        The match score is an AI-generated estimate of how well
                        the information in your profile matches the requirements
                        of the target job description.
                    </p>

                    <h2>What is included in an interview report?</h2>
                    <p>
                        Your report can include a match score, technical
                        questions, behavioral questions, identified skill gaps,
                        and a day-by-day preparation plan.
                    </p>

                    <h2>Can I view my previous reports?</h2>
                    <p>
                        Yes. Your recent interview plans are displayed on the
                        Home page after they have been generated.
                    </p>

                    <h2>Can I generate a resume?</h2>
                    <p>
                        Yes. From an interview report, you can use the resume
                        generation feature to create a PDF resume based on the
                        information provided.
                    </p>

                    <h2>Is the AI-generated content always accurate?</h2>
                    <p>
                        No. AI-generated content can contain mistakes or
                        recommendations that may not perfectly match your
                        experience. Always review the generated information
                        before using it.
                    </p>

                    <h2>Still need help?</h2>
                    <p>
                        If you encounter a problem while using Readify-AI,
                        check that you are logged in, that your internet
                        connection is working, and that the information you
                        provided is valid.
                    </p>

                </section>

                <footer className="info-page__footer">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-of-service">Terms of Service</Link>
                </footer>

            </div>
        </main>
    );
};

export default HelpCenter;