#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const express_1 = __importDefault(require("express"));
const calendarTools_js_1 = require("./tools/calendarTools.js");
// ─── Server Setup ─────────────────────────────────────────────────────────────
const server = new mcp_js_1.McpServer({
    name: "google-calendar-mcp-server",
    version: "1.0.0",
});
// Register all tools
(0, calendarTools_js_1.registerCalendarTools)(server);
// ─── Transport ────────────────────────────────────────────────────────────────
async function runStdio() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("🗓️  Google Calendar MCP Server running (stdio mode)");
}
async function runHTTP() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post("/mcp", async (req, res) => {
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", server: "google-calendar-mcp-server" });
    });
    const port = parseInt(process.env.PORT || "3000");
    app.listen(port, () => {
        console.error(`🗓️  Google Calendar MCP Server running at http://localhost:${port}/mcp`);
    });
}
// Choose transport based on env
const transport = process.env.TRANSPORT || "stdio";
if (transport === "http") {
    runHTTP().catch((err) => {
        console.error("Server error:", err);
        process.exit(1);
    });
}
else {
    runStdio().catch((err) => {
        console.error("Server error:", err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map