"use strict";
// ─── Constants ───────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAUTH_REDIRECT_URI = exports.SCOPES = exports.CHARACTER_LIMIT = exports.DEFAULT_TIMEZONE = exports.DEFAULT_MAX_RESULTS = exports.DEFAULT_CALENDAR_ID = void 0;
exports.DEFAULT_CALENDAR_ID = "primary";
exports.DEFAULT_MAX_RESULTS = 10;
exports.DEFAULT_TIMEZONE = "Asia/Kolkata"; // IST for Patna, India
exports.CHARACTER_LIMIT = 10000;
exports.SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
];
exports.OAUTH_REDIRECT_URI = "http://localhost:3000/oauth2callback";
//# sourceMappingURL=constants.js.map