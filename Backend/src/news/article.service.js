const dns = require('node:dns/promises');
const https = require('node:https');
const http = require('node:http');
const net = require('node:net');
const cheerio = require('cheerio');

// Resolve and pin a public IPv4 address; never follow redirects into private networks.
function publicAddress(address) {
    if (net.isIP(address) !== 4) return false;
    const [a, b, c] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
        (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
        (a === 198 && (b === 18 || b === 19 || b === 51)) || (a === 203 && b === 0 && c === 113));
}

async function fetchArticle(rawUrl, redirects = 0) {
    const url = new URL(rawUrl);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || (url.port && !['80', '443'].includes(url.port))) throw new Error('Unsupported article URL');
    const addresses = await dns.lookup(url.hostname, { all: true, family: 4 });
    if (!addresses.length || addresses.some(({ address }) => !publicAddress(address))) throw new Error('Article address is not public');
    const address = addresses[0].address;
    return new Promise((resolve, reject) => {
        const req = (url.protocol === 'https:' ? https : http).get(url, {
            lookup: (_host, options, callback) => options.all
                ? callback(null, [{ address, family: 4 }])
                : callback(null, address, 4),
            headers: { 'User-Agent': 'ReadifyAI-News/1.0', Accept: 'text/html' },
            timeout: 10000,
        }, (res) => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 3) {
                res.resume();
                try { resolve(fetchArticle(new URL(res.headers.location, url).href, redirects + 1)); }
                catch (error) { reject(error); }
                return;
            }
            if (res.statusCode !== 200 || !String(res.headers['content-type'] || '').includes('text/html')) { res.resume(); reject(new Error('Article unavailable')); return; }
            let size = 0;
            const chunks = [];
            res.on('data', (chunk) => { size += chunk.length; if (size > 1_000_000) res.destroy(new Error('Article too large')); else chunks.push(chunk); });
            res.on('end', () => resolve({ html: Buffer.concat(chunks).toString('utf8'), url }));
            res.on('error', reject);
        });
        req.on('timeout', () => req.destroy(new Error('Article timed out')));
        req.on('error', reject);
    });
}

async function readArticle(rawUrl) {
    const { html, url } = await fetchArticle(rawUrl);
    const $ = cheerio.load(html);
    let imageUrl = null;
    const imageCandidates = [
        $('meta[property="og:image:secure_url"]').attr('content'),
        $('meta[property="og:image"]').attr('content'),
        $('meta[name="twitter:image"]').attr('content'),
        $('meta[property="twitter:image"]').attr('content'),
        $('meta[name="twitter:image:src"]').attr('content'),
        $('link[rel="image_src"]').attr('href'),
        $('article img').first().attr('src'),
    ];
    for (const image of imageCandidates) {
        if (!image) continue;
        try {
            const candidate = new URL(image, url);
            if (candidate.protocol !== 'https:' || candidate.username || candidate.password || (candidate.port && candidate.port !== '443')) continue;
            const imageAddresses = await dns.lookup(candidate.hostname, { all: true, family: 4 });
            if (imageAddresses.length && imageAddresses.every(({ address }) => publicAddress(address))) {
                imageUrl = candidate.href;
                break;
            }
        } catch { /* Try the next metadata image. */ }
    }
    $('script, style, nav, footer, header, aside, form, noscript').remove();
    const root = $('article').first().length ? $('article').first() : $('main').first();
    const text = (root.length ? root : $('body')).find('p').map((_, el) => $(el).text().trim()).get().join('\n').replace(/\s+/g, ' ').trim().slice(0, 12000);
    return { text, imageUrl };
}

async function verifyImage(rawUrl, redirects = 0) {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) throw new Error('Unsupported image URL');
    const addresses = await dns.lookup(url.hostname, { all: true, family: 4 });
    if (!addresses.length || addresses.some(({ address }) => !publicAddress(address))) throw new Error('Image address is not public');
    const address = addresses[0].address;
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            lookup: (_host, options, callback) => options.all
                ? callback(null, [{ address, family: 4 }]) : callback(null, address, 4),
            headers: { 'User-Agent': 'ReadifyAI-News/1.0', Accept: 'image/*', Range: 'bytes=0-0' },
            timeout: 8000,
        }, (res) => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 3) {
                res.resume();
                try { resolve(verifyImage(new URL(res.headers.location, url).href, redirects + 1)); }
                catch (error) { reject(error); }
                return;
            }
            const valid = (res.statusCode === 200 || res.statusCode === 206) && /^image\//i.test(String(res.headers['content-type'] || ''));
            res.destroy();
            if (valid) resolve(url.href);
            else reject(new Error('Image unavailable'));
        });
        req.on('timeout', () => req.destroy(new Error('Image timed out')));
        req.on('error', reject);
    });
}

module.exports = { readArticle, publicAddress, verifyImage };
