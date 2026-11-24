import { Link } from "react-router";
import "./landing.scss";

const features = [
    { number: "01", label: "STAY CURIOUS", title: "Tech News", text: "Keep up with the ideas, tools, and stories shaping technology.", link: "/news", action: "Explore tech news" },
    { number: "02", label: "FIND YOUR NEXT ROLE", title: "Job Search", text: "Explore company openings and find the details that matter.", link: "/jobs", action: "Discover opportunities" },
    { number: "03", label: "PREPARE WITH PURPOSE", title: "Interview Prep", text: "Turn your experience and a job description into a focused preparation plan.", link: "/prepare", action: "Build your plan" },
];

export default function Landing() {
    return <main className="landing">
        <section className="landing-hero">
            <div className="landing-hero__copy">
                <p className="eyebrow"><span /> YOUR CAREER, IN MOTION</p>
                <h1>Get ready for<br /><em>what’s next.</em></h1>
                <p className="landing-hero__intro">Discover opportunities, stay curious about tech, and prepare for interviews with more clarity.</p>
                <div className="landing-actions"><Link className="landing-button" to="/prepare">Start preparing <span>↗</span></Link><Link className="landing-text-link" to="/news">Explore tech news <span>→</span></Link></div>
            </div>
            <div className="landing-art" aria-hidden="true"><div className="landing-art__orbit landing-art__orbit--one" /><div className="landing-art__orbit landing-art__orbit--two" /><div className="landing-art__center">R<span>✳</span></div><div className="landing-art__note">A LITTLE MORE READY<br /><strong>EVERY DAY.</strong></div><span className="landing-art__star">✳</span></div>
        </section>
        <section className="landing-features" aria-labelledby="feature-title">
            <div className="landing-section-heading"><div><p className="eyebrow">YOUR NEXT STEP STARTS HERE</p><h2 id="feature-title">A little direction goes a long way.</h2></div><p>Everything you need to explore what’s next, in one place.</p></div>
            <div className="feature-grid">{features.map((feature) => <Link className="feature-card" to={feature.link} key={feature.number}><div className="feature-card__top"><span>{feature.number} /</span><span className="feature-card__arrow">↗</span></div><p className="feature-card__label">{feature.label}</p><h3>{feature.title}</h3><p className="feature-card__text">{feature.text}</p><span className="feature-card__action">{feature.action} →</span></Link>)}</div>
        </section>
        <footer className="landing-footer"><span>© Readify AI</span><div><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms-of-service">Terms and Conditions</Link><Link to="/help">Help Centre</Link></div><span>Made for what’s next.</span></footer>
    </main>;
}
