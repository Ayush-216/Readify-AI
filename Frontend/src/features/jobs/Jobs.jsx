import { Link } from "react-router";
import "../home/landing.scss";

export default function Jobs() {
    return <main className="discovery-page"><div className="discovery-page__inner">
        <p className="eyebrow"><span /> FIND YOUR NEXT MOVE</p>
        <h1>Good things<br /><em>are out there.</em></h1>
        <p className="discovery-page__intro">Explore company openings and get a clearer picture of what each role is looking for.</p>
        <div className="discovery-heading"><div><p className="eyebrow">YOUR OPPORTUNITIES</p><h2>Find an open position.</h2></div><span className="discovery-badge">JOB SEARCH</span></div>
        <div className="job-filter"><label htmlFor="company">Company</label><select id="company" disabled defaultValue=""><option value="">Company selection coming soon</option></select></div>
        <section className="discovery-empty"><span className="discovery-empty__icon" aria-hidden="true">↗</span><h3>Your next opportunity starts here.</h3><p>Company listings and job details will be connected in a future update.</p><Link to="/">Back to home →</Link></section>
    </div></main>;
}
