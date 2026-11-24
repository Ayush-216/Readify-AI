import { useEffect, useRef, useState } from "react";
import "../home/landing.scss";
import "./news.scss";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function NewsCard({ article, onImageFailure }) {
    const [imageAttempts, setImageAttempts] = useState(0);
    const handleImageError = () => {
        if (imageAttempts < 2) setImageAttempts((attempt) => attempt + 1);
        else onImageFailure(article.id);
    };
    return <article className="news-card">
        <div className="news-card__image">
            <img key={imageAttempts} src={article.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" onError={handleImageError} />
        </div>
        <div className="news-card__body">
            <p className="news-card__meta">{article.source} <span>·</span> Submitted {new Date(article.submittedAt).toLocaleString()}</p>
            <h3><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h3>
            <p className="news-card__label">AI SUMMARY</p><ul>{article.points.map((point, index) => <li key={index}>{point}</li>)}</ul>
            <a className="news-card__link" href={article.url} target="_blank" rel="noopener noreferrer">Read original article ↗</a>
        </div>
    </article>;
}

export default function News() {
    const [feed, setFeed] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [failedImages, setFailedImages] = useState(() => new Set());
    const lastUpdated = useRef(null);
    useEffect(() => {
        const controller = new AbortController();
        const load = () => fetch(`${API_BASE}/api/news`, { signal: controller.signal })
            .then((response) => { if (!response.ok) throw new Error('News unavailable'); return response.json(); })
            .then((data) => {
                if (data.lastUpdated !== lastUpdated.current) {
                    lastUpdated.current = data.lastUpdated;
                    setFailedImages(new Set());
                }
                setFeed(data);
                setError(false);
            }).catch((err) => { if (err.name !== 'AbortError') setError(true); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        load();
        const interval = setInterval(load, 30 * 1000);
        return () => { clearInterval(interval); controller.abort(); };
    }, []);

    const articles = [...(feed?.articles || []), ...(feed?.backups || [])]
        .filter((article) => article.imageUrl && Array.isArray(article.points) && article.points.length > 0 && !failedImages.has(article.id))
        .slice(0, 10);
    const hideFailedImage = (id) => setFailedImages((previous) => new Set([...previous, id]));

    return <main className="discovery-page"><div className="discovery-page__inner">
        <p className="eyebrow"><span /> THE CURIOUS CORNER</p>
        <h1>Tech moves fast.<br /><em>Stay in the know.</em></h1>
        <p className="discovery-page__intro">A place for the ideas, launches, and conversations moving technology forward.</p>
        <div className="discovery-heading"><div><p className="eyebrow">THE LATEST</p><h2>Stories worth your time.</h2></div><span className="discovery-badge">TOP TECH NEWS</span></div>
        {feed?.lastUpdated && <p className="news-updated">Last updated {new Date(feed.lastUpdated).toLocaleString()}{feed.stale && " · Update delayed; showing previous stories"}</p>}
        {feed && articles.length > 0 && articles.length < 10 && <p className="news-updated">More complete stories will appear after the next refresh.</p>}
        {loading ? <section className="discovery-empty"><h3>Loading stories…</h3></section>
            : error && !feed ? <section className="discovery-empty"><h3>News is temporarily unavailable.</h3><p>Please try again later.</p></section>
            : !articles.length ? <section className="discovery-empty"><h3>No complete stories are available right now.</h3><p>Please check back after the next refresh.</p></section>
            : <div className="news-list">{articles.map((article) => <NewsCard key={`${article.id}-${article.imageUrl}`} article={article} onImageFailure={hideFailedImage} />)}</div>}
        {error && feed && <p className="news-disclaimer">Could not check for updates; showing previous stories.</p>}
        <p className="news-disclaimer">Stories via Hacker News. AI summaries can contain errors; refer to the original source.</p>
    </div></main>;
}
