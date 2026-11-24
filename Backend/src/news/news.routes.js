const router = require('express').Router();
const { getNews } = require('./news.service');

router.get('/', async (_req, res) => {
    try { res.json(await getNews()); }
    catch { res.status(503).json({ message: 'News is temporarily unavailable.' }); }
});

module.exports = router;
