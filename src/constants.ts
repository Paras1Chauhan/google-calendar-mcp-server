// ─── Constants ───────────────────────────────────────────────────────────────

export const DEFAULT_CALENDAR_ID = "primary";
export const DEFAULT_MAX_RESULTS = 10;
export const DEFAULT_TIMEZONE = "Asia/Kolkata"; // IST for Patna, India
export const CHARACTER_LIMIT = 10000;

export const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

export const OAUTH_REDIRECT_URI = "http://localhost:3000/oauth2callback";