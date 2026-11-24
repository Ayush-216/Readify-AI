const crypto = require('node:crypto');
const NewsSnapshot = require('./news.model');
const { readArticle, verifyImage } = require('./article.service');
const { summarizeArticle } = require('./groq.service');
const { retry, isComplete, fillFromPrevious } = require('./news.selection');

const INTERVAL = 60 * 60 * 1000;
const SNAPSHOT = 'top-tech-news';
let running = false;

async function getNews() {
    const snapshot = await NewsSnapshot.findById(SNAPSHOT).lean();
    const eligible = (snapshot?.articles || []).filter(isComplete);
    return { articles: eligible.slice(0, 10), backups: eligible.slice(10), lastUpdated: snapshot?.lastUpdated || null, stale: !snapshot?.lastUpdated || Date.now() - new Date(snapshot.lastUpdated).getTime() > INTERVAL * 2 };
}

async function hnJson(path) {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/${path}.json`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`Hacker News request failed (${res.status})`);
    return res.json();
}

async function refreshNews() {
    if (running) return false;
    running = true;
    const owner = crypto.randomUUID();
    let locked = false;
    let heartbeat;
    try {
        await NewsSnapshot.updateOne({ _id: SNAPSHOT }, { $setOnInsert: { articles: [] } }, { upsert: true });
        const acquired = await NewsSnapshot.findOneAndUpdate({ _id: SNAPSHOT, $or: [{ lockUntil: { $exists: false } }, { lockUntil: { $lt: new Date() } }] }, { $set: { lockOwner: owner, lockUntil: new Date(Date.now() + 2 * 60 * 1000) } }, { returnDocument: 'after' }).lean();
        if (!acquired) return false;
        locked = true;
        heartbeat = setInterval(() => {
            NewsSnapshot.updateOne({ _id: SNAPSHOT, lockOwner: owner }, { $set: { lockUntil: new Date(Date.now() + 2 * 60 * 1000) } })
                .catch((error) => console.error(`News lock renewal failed: ${error.message}`));
        }, 30 * 1000);
        heartbeat.unref();
        const [top, recent] = await Promise.all([hnJson('topstories'), hnJson('newstories')]);
        if (!Array.isArray(top) || !Array.isArray(recent)) throw new Error('Invalid Hacker News response');
        const ids = [...new Set([...top.slice(0, 150), ...recent.slice(0, 100)])];
        const results = [];
        for (let i = 0; i < ids.length; i += 25) {
            results.push(...await Promise.allSettled(ids.slice(i, i + 25).map((id) => hnJson(`item/${id}`))));
        }
        const now = Date.now();
        const stories = results.flatMap((result) => result.status === 'fulfilled' && result.value ? [result.value] : [])
            .filter((item) => item.type === 'story' && item.url && item.title && !item.dead && !item.deleted && item.time && now - item.time * 1000 < 72 * INTERVAL)
            .filter((item) => { try { return ['http:', 'https:'].includes(new URL(item.url).protocol); } catch { return false; } })
            .sort((a, b) => {
                const relevance = (item) => /\b(ai|software|programming|developer|code|computer|security|cloud|chip|open.source|linux|browser|web|database|language|python|java|javascript|rust|hardware|tech)\b/i.test(item.title) ? 1.5 : 1;
                const rank = (item) => ((item.score || 0) + 1) * relevance(item) / Math.pow((now / 1000 - item.time) / 3600 + 2, 1.2);
                return rank(b) - rank(a);
            });
        if (results.filter((r) => r.status === 'fulfilled').length < ids.length / 2 || !stories.length) throw new Error('Insufficient news results');
        const previous = new Map((acquired.articles || []).map((article) => [article.id, article]));
        const seen = new Set();
        let articles = [];
        const rejected = new Set();
        const deadline = Date.now() + 20 * 60 * 1000;
        const candidates = [];
        for (const story of stories) {
            let url;
            try { const parsed = new URL(story.url); parsed.hash = ''; url = parsed.href; } catch { continue; }
            if (seen.has(url)) continue;
            seen.add(url);
            candidates.push({ story, url });
        }
        async function enrich({ story, url }) {
            const old = previous.get(story.id);
            try {
                let imageUrl = old?.imageUrl;
                let points = old?.points;
                let article;
                if (!imageUrl || !points?.length) {
                    article = await retry(async () => {
                        const result = await readArticle(url);
                        if (!imageUrl && !result.imageUrl) throw new Error('No image found');
                        if (!points?.length && result.text.length < 300) throw new Error('Insufficient article text');
                        return result;
                    });
                    imageUrl ||= article.imageUrl;
                }
                imageUrl = await retry(() => verifyImage(imageUrl));
                if (!points?.length) {
                    points = await retry(async () => {
                        const result = await summarizeArticle(story.title, article.text);
                        if (!result.length) throw new Error('Empty summary');
                        return result;
                    });
                }
                const candidate = { id: story.id, title: story.title, url, imageUrl, points, submittedAt: new Date(story.time * 1000).toISOString(), source: new URL(url).hostname, score: story.score || 0 };
                return isComplete(candidate) ? candidate : null;
            } catch (error) {
                rejected.add(story.id);
                console.warn(`News story ${story.id} skipped after retries: ${error.message}`);
                return null;
            }
        }
        for (let i = 0; i < candidates.length && articles.length < 15 && Date.now() < deadline; i += 4) {
            const batch = await Promise.all(candidates.slice(i, i + 4).map(enrich));
            articles.push(...batch.filter(Boolean));
        }
        articles = fillFromPrevious(articles.slice(0, 15), acquired.articles || [], rejected, now);
        if (!articles.length) throw new Error('No usable news stories');
        await NewsSnapshot.updateOne({ _id: SNAPSHOT, lockOwner: owner }, { $set: { articles, lastUpdated: new Date() } });
        console.log(`News refreshed: ${articles.length} stories`);
    } catch (error) { console.error(`News refresh failed: ${error.message}`); }
    finally {
        if (heartbeat) clearInterval(heartbeat);
        if (locked) await NewsSnapshot.updateOne({ _id: SNAPSHOT, lockOwner: owner }, { $unset: { lockOwner: '', lockUntil: '' } }).catch(() => {});
        running = false;
    }
    return true;
}

function startNewsScheduler() {
    const startWhenAvailable = () => refreshNews().then((started) => {
        if (!started) {
            const retryTimer = setTimeout(startWhenAvailable, 2 * 60 * 1000 + 1000);
            retryTimer.unref();
        }
    });
    startWhenAvailable();
    const timer = setInterval(refreshNews, INTERVAL);
    timer.unref();
    return timer;
}

module.exports = { getNews, refreshNews, startNewsScheduler };
