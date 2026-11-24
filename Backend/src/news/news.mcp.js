// Run as a separate stdio MCP server: npm run mcp:news
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { getNews } = require('./news.service');

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    const server = new McpServer({ name: 'readify-news', version: '1.0.0' });
    server.registerTool('get_top_tech_news', {
        description: 'Read the cached top tech news, AI-generated points, source links, and last refresh time.',
        inputSchema: {},
    }, async () => ({ content: [{ type: 'text', text: JSON.stringify(await getNews()) }] }));
    await server.connect(new StdioServerTransport());
}

main().catch((error) => { console.error(`News MCP server failed: ${error.message}`); process.exitCode = 1; });
