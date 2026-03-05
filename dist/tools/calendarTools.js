"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCalendarTools = registerCalendarTools;
const zod_1 = require("zod");
const index_js_1 = require("../schemas/index.js");
const calendarService_js_1 = require("../services/calendarService.js");
const constants_js_1 = require("../constants.js");
// ─── Helper ──────────────────────────────────────────────────────────────────
function textContent(text) {
    return { content: [{ type: "text", text }] };
}
function truncate(text) {
    if (text.length > constants_js_1.CHARACTER_LIMIT) {
        return text.slice(0, constants_js_1.CHARACTER_LIMIT) + "\n\n...[truncated, use filters to narrow results]";
    }
    return text;
}
// ─── Register All Tools ──────────────────────────────────────────────────────
function registerCalendarTools(server) {
    // ── 1. Authenticate ────────────────────────────────────────────────────────
    server.registerTool("calendar_authenticate", {
        title: "Authenticate with Google Calendar",
        description: `Complete Google OAuth 2.0 authentication to access your calendar.

This is a ONE-TIME setup. After authenticating, your token is saved locally.

Step 1: Call this tool WITHOUT a code first - it will return an authorization URL.
Step 2: Open that URL in your browser and sign in with Google.
Step 3: Copy the 'code' from the redirect URL and call this tool again with it.

Args:
  - code (string, optional): The OAuth authorization code from the redirect URL.

Returns:
  - Auth URL to visit (if no code provided)
  - Success confirmation (if code is valid)
  - Error message if authentication fails`,
        inputSchema: zod_1.z.object({
            code: zod_1.z.string().optional().describe("OAuth authorization code from redirect URL (omit for first call)"),
        }).strict(),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ code }) => {
        const auth = (0, calendarService_js_1.createOAuth2Client)();
        if (!code) {
            // Already authenticated?
            if ((0, calendarService_js_1.loadSavedToken)(auth)) {
                return textContent("✅ Already authenticated! You can use all calendar tools.");
            }
            const url = (0, calendarService_js_1.getAuthUrl)(auth);
            return textContent(`🔐 **Authorization Required**\n\n` +
                `Open this URL in your browser:\n\n${url}\n\n` +
                `After signing in, you'll be redirected to a URL like:\n` +
                `http://localhost:3000/oauth2callback?code=YOUR_CODE&...\n\n` +
                `Copy the value of the 'code' parameter and call this tool again with it.`);
        }
        await (0, calendarService_js_1.getTokenFromCode)(auth, code);
        return textContent("✅ Authentication successful! Token saved. You can now use all Google Calendar tools.");
    });
    // ── 2. Create Meeting ──────────────────────────────────────────────────────
    server.registerTool("calendar_create_meeting", {
        title: "Create Meeting with Google Meet Link",
        description: `Create a new Google Calendar event with an optional Google Meet video link.

This tool creates a calendar invite, sends email notifications to all attendees,
and optionally generates a Google Meet link automatically.

Args:
  - title (string): Meeting title (required)
  - startTime (string): ISO 8601 start time (e.g. '2026-03-10T10:00:00')
  - endTime (string): ISO 8601 end time (e.g. '2026-03-10T11:00:00')
  - attendees (string[]): List of attendee email addresses
  - description (string): Meeting agenda or notes
  - location (string): Physical location or conference room
  - addMeetLink (boolean): Auto-generate a Google Meet link (default: true)
  - timeZone (string): IANA timezone (default: 'Asia/Kolkata')

Returns:
  Created event details including Google Meet link, event ID, and calendar link.

Examples:
  - "Schedule a team standup tomorrow at 10am for 30 minutes"
  - "Create a meeting with john@example.com on Friday 3pm-4pm with Meet link"`,
        inputSchema: index_js_1.CreateMeetingSchema,
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async (params) => {
        const calendar = await (0, calendarService_js_1.getAuthenticatedCalendar)();
        const eventBody = {
            summary: params.title,
            description: params.description,
            location: params.location,
            start: {
                dateTime: params.startTime,
                timeZone: params.timeZone || constants_js_1.DEFAULT_TIMEZONE,
            },
            end: {
                dateTime: params.endTime,
                timeZone: params.timeZone || constants_js_1.DEFAULT_TIMEZONE,
            },
            attendees: (params.attendees || []).map((email) => ({ email })),
        };
        if (params.addMeetLink !== false) {
            eventBody.conferenceData = {
                createRequest: {
                    requestId: `meet-${Date.now()}`,
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                },
            };
        }
        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: eventBody,
            conferenceDataVersion: params.addMeetLink !== false ? 1 : 0,
            sendUpdates: "all",
        });
        const event = (0, calendarService_js_1.formatEvent)(response.data);
        const output = {
            success: true,
            event,
            message: params.addMeetLink !== false && event.meetLink
                ? `✅ Meeting created with Google Meet link: ${event.meetLink}`
                : `✅ Meeting created successfully`,
        };
        return {
            content: [{ type: "text", text: (0, calendarService_js_1.formatEventMarkdown)(event) }],
            structuredContent: output,
        };
    });
    // ── 3. List Events ────────────────────────────────────────────────────────
    server.registerTool("calendar_list_events", {
        title: "List Calendar Events",
        description: `List upcoming events from Google Calendar with optional filters.

Args:
  - startDate (string): Start of range (ISO 8601, default: today)
  - endDate (string): End of range (ISO 8601, default: 7 days from now)
  - maxResults (number): Max events to return (1-100, default: 10)
  - query (string): Text search to filter events
  - calendarId (string): Calendar ID (default: 'primary')

Returns:
  List of events with titles, times, attendees, and Meet links.

Examples:
  - "Show my meetings for this week"
  - "List all events with John next month"
  - "What's on my calendar today?"`,
        inputSchema: index_js_1.ListEventsSchema,
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    }, async (params) => {
        const calendar = await (0, calendarService_js_1.getAuthenticatedCalendar)();
        const now = new Date();
        const timeMin = params.startDate
            ? new Date(params.startDate).toISOString()
            : now.toISOString();
        const defaultEnd = new Date(now);
        defaultEnd.setDate(defaultEnd.getDate() + 7);
        const timeMax = params.endDate
            ? new Date(params.endDate).toISOString()
            : defaultEnd.toISOString();
        const response = await calendar.events.list({
            calendarId: params.calendarId || "primary",
            timeMin,
            timeMax,
            maxResults: params.maxResults || 10,
            singleEvents: true,
            orderBy: "startTime",
            q: params.query,
        });
        const events = (response.data.items || []).map(calendarService_js_1.formatEvent);
        if (events.length === 0) {
            return textContent("📭 No events found for the specified time range.");
        }
        const lines = [
            `📅 **Found ${events.length} event(s)**\n`,
            ...events.map((e, i) => `### ${i + 1}. ${e.summary}\n` + (0, calendarService_js_1.formatEventMarkdown)(e)),
        ];
        const output = { total: events.length, events };
        return {
            content: [{ type: "text", text: truncate(lines.join("\n\n")) }],
            structuredContent: output,
        };
    });
    // ── 4. Get Event ──────────────────────────────────────────────────────────
    server.registerTool("calendar_get_event", {
        title: "Get Event Details",
        description: `Retrieve full details of a specific calendar event by its ID.

Args:
  - eventId (string): The Google Calendar event ID
  - calendarId (string): Calendar ID (default: 'primary')

Returns:
  Complete event details: title, time, attendees, Meet link, description.`,
        inputSchema: index_js_1.GetEventSchema,
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const calendar = await (0, calendarService_js_1.getAuthenticatedCalendar)();
        const response = await calendar.events.get({
            calendarId: params.calendarId || "primary",
            eventId: params.eventId,
        });
        const event = (0, calendarService_js_1.formatEvent)(response.data);
        return {
            content: [{ type: "text", text: (0, calendarService_js_1.formatEventMarkdown)(event) }],
            structuredContent: { event },
        };
    });
    // ── 5. Update Event ───────────────────────────────────────────────────────
    server.registerTool("calendar_update_event", {
        title: "Update Calendar Event",
        description: `Update an existing calendar event. Only provided fields will be changed.

Args:
  - eventId (string): The event ID to update (required)
  - title (string): New title (optional)
  - startTime (string): New start time ISO 8601 (optional)
  - endTime (string): New end time ISO 8601 (optional)
  - attendees (string[]): New attendee list - replaces existing (optional)
  - description (string): New description (optional)
  - addMeetLink (boolean): Add a Meet link if not present (optional)
  - timeZone (string): Timezone for updated times

Returns:
  Updated event details.

Examples:
  - "Move the 3pm meeting to 4pm"
  - "Add sarah@company.com to the Friday standup"`,
        inputSchema: index_js_1.UpdateEventSchema,
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    }, async (params) => {
        const calendar = await (0, calendarService_js_1.getAuthenticatedCalendar)();
        // Fetch existing event first
        const existing = await calendar.events.get({
            calendarId: "primary",
            eventId: params.eventId,
        });
        const eventBody = { ...existing.data };
        if (params.title)
            eventBody.summary = params.title;
        if (params.description)
            eventBody.description = params.description;
        if (params.startTime) {
            eventBody.start = { dateTime: params.startTime, timeZone: params.timeZone || constants_js_1.DEFAULT_TIMEZONE };
        }
        if (params.endTime) {
            eventBody.end = { dateTime: params.endTime, timeZone: params.timeZone || constants_js_1.DEFAULT_TIMEZONE };
        }
        if (params.attendees) {
            eventBody.attendees = params.attendees.map((email) => ({ email }));
        }
        if (params.addMeetLink && !existing.data.conferenceData) {
            eventBody.conferenceData = {
                createRequest: {
                    requestId: `meet-update-${Date.now()}`,
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                },
            };
        }
        const response = await calendar.events.update({
            calendarId: "primary",
            eventId: params.eventId,
            requestBody: eventBody,
            conferenceDataVersion: params.addMeetLink ? 1 : 0,
            sendUpdates: "all",
        });
        const event = (0, calendarService_js_1.formatEvent)(response.data);
        return {
            content: [{ type: "text", text: `✅ Event updated!\n\n${(0, calendarService_js_1.formatEventMarkdown)(event)}` }],
            structuredContent: { success: true, event },
        };
    });
    // ── 6. Delete Event ───────────────────────────────────────────────────────
    server.registerTool("calendar_delete_event", {
        title: "Delete / Cancel Calendar Event",
        description: `Delete or cancel a Google Calendar event. All attendees will receive cancellation emails.

⚠️ This action is irreversible. The event will be permanently removed.

Args:
  - eventId (string): The event ID to delete (required)
  - calendarId (string): Calendar ID (default: 'primary')

Returns:
  Confirmation of deletion.`,
        inputSchema: index_js_1.DeleteEventSchema,
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const calendar = await (0, calendarService_js_1.getAuthenticatedCalendar)();
        await calendar.events.delete({
            calendarId: params.calendarId || "primary",
            eventId: params.eventId,
            sendUpdates: "all",
        });
        return textContent(`🗑️ Event '${params.eventId}' has been cancelled and attendees notified.`);
    });
    // ── 7. Check Free/Busy ────────────────────────────────────────────────────
    server.registerTool("calendar_check_availability", {
        title: "Check People's Availability (Free/Busy)",
        description: `Check when people are free or busy during a time range. Useful before scheduling meetings.

Args:
  - emails (string[]): List of 1-10 email addresses to check
  - startTime (string): Start of time range in ISO 8601
  - endTime (string): End of time range in ISO 8601

Returns:
  For each email, list of busy time slots within the range.

Examples:
  - "Is john@company.com free tomorrow from 2pm to 5pm?"
  - "Find a time when the whole team is free next week"`,
        inputSchema: index_js_1.FreeBusySchema,
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    }, async (params) => {
        const calendar = await (0, calendarService_js_1.getAuthenticatedCalendar)();
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: params.startTime,
                timeMax: params.endTime,
                items: params.emails.map((email) => ({ id: email })),
            },
        });
        const calendars = response.data.calendars || {};
        const lines = [`📊 **Availability Report**\n`];
        for (const email of params.emails) {
            const calData = calendars[email];
            const busySlots = calData?.busy || [];
            if (busySlots.length === 0) {
                lines.push(`✅ **${email}**: Free for the entire period`);
            }
            else {
                lines.push(`❌ **${email}**: Busy during:`);
                busySlots.forEach((slot) => {
                    lines.push(`  - ${new Date(slot.start || "").toLocaleString()} → ${new Date(slot.end || "").toLocaleString()}`);
                });
            }
        }
        return {
            content: [{ type: "text", text: lines.join("\n") }],
            structuredContent: { calendars },
        };
    });
    // ── 8. List Calendars ─────────────────────────────────────────────────────
    server.registerTool("calendar_list_calendars", {
        title: "List All Calendars",
        description: `List all Google Calendars accessible to the authenticated user.

Args:
  - maxResults (number): Max calendars to return (default: 20)

Returns:
  List of calendar names and IDs.`,
        inputSchema: index_js_1.ListCalendarsSchema,
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const calendar = await (0, calendarService_js_1.getAuthenticatedCalendar)();
        const response = await calendar.calendarList.list({
            maxResults: params.maxResults || 20,
        });
        const items = response.data.items || [];
        const lines = [
            `📚 **Your Calendars (${items.length})**\n`,
            ...items.map((c) => `- **${c.summary}** (ID: \`${c.id}\`) — ${c.accessRole}`),
        ];
        return {
            content: [{ type: "text", text: lines.join("\n") }],
            structuredContent: { calendars: items.map((c) => ({ id: c.id, name: c.summary, role: c.accessRole })) },
        };
    });
}
//# sourceMappingURL=calendarTools.js.map