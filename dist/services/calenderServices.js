"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CALENDAR_ID = void 0;
exports.createOAuth2Client = createOAuth2Client;
exports.getAuthUrl = getAuthUrl;
exports.getTokenFromCode = getTokenFromCode;
exports.loadSavedToken = loadSavedToken;
exports.getCalendarClient = getCalendarClient;
exports.formatEvent = formatEvent;
exports.formatEventMarkdown = formatEventMarkdown;
exports.getAuthenticatedCalendar = getAuthenticatedCalendar;
const googleapis_1 = require("googleapis");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const constants_js_1 = require("../constants.js");
Object.defineProperty(exports, "DEFAULT_CALENDAR_ID", { enumerable: true, get: function () { return constants_js_1.DEFAULT_CALENDAR_ID; } });
// ─── Auth Setup ──────────────────────────────────────────────────────────────
const TOKEN_PATH = path.join(process.cwd(), "token.json");
function createOAuth2Client() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/oauth2callback";
    if (!clientId || !clientSecret) {
        throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables.\n" +
            "Please set them in your .env file or shell environment.\n" +
            "See README.md for setup instructions.");
    }
    return new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
}
function getAuthUrl(oauth2Client) {
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: constants_js_1.SCOPES,
        prompt: "consent",
    });
}
async function getTokenFromCode(oauth2Client, code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}
function loadSavedToken(oauth2Client) {
    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
        oauth2Client.setCredentials(token);
        return true;
    }
    return false;
}
function getCalendarClient(auth) {
    return googleapis_1.google.calendar({ version: "v3", auth });
}
// ─── Response Formatter ──────────────────────────────────────────────────────
function formatEvent(event) {
    const attendees = (event.attendees || []).map((a) => ({
        email: a.email || "",
        displayName: a.displayName || undefined,
        responseStatus: a.responseStatus || undefined,
    }));
    const meetLink = event.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === "video")?.uri || undefined;
    return {
        id: event.id || "",
        summary: event.summary || "(No Title)",
        description: event.description || undefined,
        location: event.location || undefined,
        startTime: event.start?.dateTime || event.start?.date || "",
        endTime: event.end?.dateTime || event.end?.date || "",
        attendees,
        meetLink,
        status: event.status || "confirmed",
        htmlLink: event.htmlLink || "",
        organizer: event.organizer?.email || "",
    };
}
function formatEventMarkdown(event) {
    const lines = [
        `## 📅 ${event.summary}`,
        `- **ID**: ${event.id}`,
        `- **Start**: ${new Date(event.startTime).toLocaleString()}`,
        `- **End**: ${new Date(event.endTime).toLocaleString()}`,
        `- **Status**: ${event.status}`,
        `- **Organizer**: ${event.organizer}`,
    ];
    if (event.description)
        lines.push(`- **Description**: ${event.description}`);
    if (event.location)
        lines.push(`- **Location**: ${event.location}`);
    if (event.meetLink)
        lines.push(`- **🎥 Google Meet**: ${event.meetLink}`);
    if (event.htmlLink)
        lines.push(`- **🔗 Calendar Link**: ${event.htmlLink}`);
    if (event.attendees.length > 0) {
        lines.push(`- **Attendees (${event.attendees.length})**:`);
        event.attendees.forEach((a) => {
            const status = a.responseStatus ? ` (${a.responseStatus})` : "";
            lines.push(`  - ${a.displayName || a.email}${status}`);
        });
    }
    return lines.join("\n");
}
// ─── Shared API Helper ───────────────────────────────────────────────────────
async function getAuthenticatedCalendar() {
    const auth = createOAuth2Client();
    const hasToken = loadSavedToken(auth);
    if (!hasToken) {
        const url = getAuthUrl(auth);
        throw new Error(`Not authenticated. Please authorize the app first.\n` +
            `Open this URL in your browser:\n${url}\n` +
            `Then use the calendar_authenticate tool with the code from the redirect URL.`);
    }
    return getCalendarClient(auth);
}
//# sourceMappingURL=calenderServices.js.map