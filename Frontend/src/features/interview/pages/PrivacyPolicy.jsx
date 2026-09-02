import React from "react";
import { Link } from "react-router";
import "../style/info-pages.scss";

const PrivacyPolicy = () => {
    return (
        <main className="info-page">
            <div className="info-page__container">

                <Link to="/" className="info-page__back">
                    ← Back to Readify-AI
                </Link>

                <header className="info-page__header">
                    <h1>Privacy Policy</h1>
                    <p>How Readify-AI handles your information.</p>
                </header>

                <section className="info-page__content">

                    <h2>1. Information We Collect</h2>
                    <p>
                        Readify-AI may collect information that you provide while
                        creating an account, including your username, email address,
                        and password.
                    </p>

                    <p>
                        When you use the interview preparation features, you may
                        also provide a resume, job description, and personal
                        self-description.
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        The information you provide is used to create personalized
                        interview preparation reports, including interview
                        questions, skill gap analysis, preparation plans, and
                        resume generation.
                    </p>

                    <h2>3. Resume and Profile Information</h2>
                    <p>
                        Resume and profile information is used to personalize the
                        AI-generated recommendations for the job you are targeting.
                        You should avoid providing information that is not necessary
                        for using the application.
                    </p>

                    <h2>4. AI Processing</h2>
                    <p>
                        Readify-AI uses AI services to analyze the information you
                        provide and generate interview preparation content.
                        AI-generated content should be reviewed by you before
                        relying on it for important decisions.
                    </p>

                    <h2>5. Data Security</h2>
                    <p>
                        We take reasonable measures to protect information stored
                        by the application. However, no online service can guarantee
                        complete security of information.
                    </p>

                    <h2>6. Your Account</h2>
                    <p>
                        You are responsible for keeping your account credentials
                        secure. If you believe your account has been accessed
                        without authorization, you should take appropriate steps
                        to secure your account.
                    </p>

                    <h2>7. Changes to This Policy</h2>
                    <p>
                        This Privacy Policy may be updated as Readify-AI evolves.
                        Any updated version will be reflected on this page.
                    </p>

                    <h2>8. Contact</h2>
                    <p>
                        If you have questions about this Privacy Policy or how
                        Readify-AI handles information, please use the Help Center
                        or contact the project administrator.
                    </p>

                </section>

                <footer className="info-page__footer">
                    <Link to="/terms-of-service">Terms of Service</Link>
                    <Link to="/help">Help Center</Link>
                </footer>

            </div>
        </main>
    );
};

export default PrivacyPolicy;