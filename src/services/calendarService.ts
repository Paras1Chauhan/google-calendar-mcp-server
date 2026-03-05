import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { SCOPES } from "../constants.js";
import type { CalendarEvent, Attendee } from "../types.js";

// ─── Auth Setup ──────────────────────────────────────────────────────────────

const TOKEN_PATH = path.join(os.homedir(), ".google-calendar-mcp", "token.json");

export function createOAuth2Client(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/oauth2callback";

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables.\n" +
      "Please set them in your .env file or shell environment.\n" +
      "See README.md for setup instructions."
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl(oauth2Client: OAuth2Client): string {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

export async function getTokenFromCode(
  oauth2Client: OAuth2Client,
  code: string
): Promise<void> {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}

export function loadSavedToken(oauth2Client: OAuth2Client): boolean {
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")) as Record<string, unknown>;
    oauth2Client.setCredentials(token);
    return true;
  }
  return false;
}

export function getCalendarClient(auth: OAuth2Client): calendar_v3.Calendar {
  return google.calendar({ version: "v3", auth });
}

// ─── Response Formatter ──────────────────────────────────────────────────────

export function formatEvent(event: calendar_v3.Schema$Event): CalendarEvent {
  const attendees: Attendee[] = (event.attendees || []).map(
    (a: calendar_v3.Schema$EventAttendee) => ({
      email: a.email || "",
      displayName: a.displayName || undefined,
      responseStatus: a.responseStatus || undefined,
    })
  );

  const meetLink =
    event.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri || undefined;

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

export function formatEventMarkdown(event: CalendarEvent): string {
  const lines: string[] = [
    `## 📅 ${event.summary}`,
    `- **ID**: ${event.id}`,
    `- **Start**: ${new Date(event.startTime).toLocaleString()}`,
    `- **End**: ${new Date(event.endTime).toLocaleString()}`,
    `- **Status**: ${event.status}`,
    `- **Organizer**: ${event.organizer}`,
  ];

  if (event.description) lines.push(`- **Description**: ${event.description}`);
  if (event.location) lines.push(`- **Location**: ${event.location}`);
  if (event.meetLink) lines.push(`- **🎥 Google Meet**: ${event.meetLink}`);
  if (event.htmlLink) lines.push(`- **🔗 Calendar Link**: ${event.htmlLink}`);

  if (event.attendees.length > 0) {
    lines.push(`- **Attendees (${event.attendees.length})**:`);
    event.attendees.forEach((a: Attendee) => {
      const status = a.responseStatus ? ` (${a.responseStatus})` : "";
      lines.push(`  - ${a.displayName || a.email}${status}`);
    });
  }

  return lines.join("\n");
}

// ─── Shared API Helper ───────────────────────────────────────────────────────

export async function getAuthenticatedCalendar(): Promise<calendar_v3.Calendar> {
  const auth = createOAuth2Client();
  const hasToken = loadSavedToken(auth);
  if (!hasToken) {
    const url = getAuthUrl(auth);
    throw new Error(
      `Not authenticated. Please authorize the app first.\n` +
      `Open this URL in your browser:\n${url}\n` +
      `Then use the calendar_authenticate tool with the code from the redirect URL.`
    );
  }
  return getCalendarClient(auth);
}