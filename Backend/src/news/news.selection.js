async function retry(operation, retries = 2) {
    let error;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try { return await operation(); }
        catch (err) { error = err; }
    }
    throw error;
}

function isComplete(article) {
    return Boolean(article?.imageUrl && Array.isArray(article.points) && article.points.some((point) => typeof point === 'string' && point.trim()));
}

function fillFromPrevious(current, previous, rejected, now, max = 15) {
    const result = [...current];
    const ids = new Set(result.map((article) => article.id));
    const urls = new Set(result.map((article) => article.url));
    for (const article of previous) {
        const age = now - new Date(article.submittedAt).getTime();
        if (result.length >= max) break;
        if (!isComplete(article) || rejected.has(article.id) || ids.has(article.id) || urls.has(article.url) || !Number.isFinite(age) || age < 0 || age > 72 * 60 * 60 * 1000) continue;
        result.push(article);
        ids.add(article.id);
        urls.add(article.url);
    }
    return result;
}

module.exports = { retry, isComplete, fillFromPrevious };
