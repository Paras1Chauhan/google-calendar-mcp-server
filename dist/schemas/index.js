"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCalendarsSchema = exports.AuthenticateSchema = exports.FreeBusySchema = exports.DeleteEventSchema = exports.UpdateEventSchema = exports.GetEventSchema = exports.ListEventsSchema = exports.CreateMeetingSchema = void 0;
const zod_1 = require("zod");
const constants_js_1 = require("../constants.js");
// ─── Schemas ─────────────────────────────────────────────────────────────────
exports.CreateMeetingSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title cannot be empty")
        .max(500, "Title too long")
        .describe("Title/summary of the meeting"),
    startTime: zod_1.z
        .string()
        .describe("Start time in ISO 8601 format (e.g. '2026-03-10T10:00:00'). If no timezone offset is included, timeZone field is used."),
    endTime: zod_1.z
        .string()
        .describe("End time in ISO 8601 format (e.g. '2026-03-10T11:00:00')"),
    attendees: zod_1.z
        .array(zod_1.z.string().email("Must be a valid email address"))
        .optional()
        .default([])
        .describe("List of attendee email addresses to invite"),
    description: zod_1.z
        .string()
        .max(2000)
        .optional()
        .describe("Optional description or agenda for the meeting"),
    location: zod_1.z
        .string()
        .max(500)
        .optional()
        .describe("Optional physical or virtual location"),
    addMeetLink: zod_1.z
        .boolean()
        .default(true)
        .describe("Whether to auto-generate a Google Meet video link (default: true)"),
    timeZone: zod_1.z
        .string()
        .default(constants_js_1.DEFAULT_TIMEZONE)
        .describe(`IANA timezone (e.g. 'Asia/Kolkata', 'America/New_York'). Default: ${constants_js_1.DEFAULT_TIMEZONE}`),
}).strict();
exports.ListEventsSchema = zod_1.z.object({
    startDate: zod_1.z
        .string()
        .optional()
        .describe("Start of date range in ISO 8601 (e.g. '2026-03-01'). Defaults to today."),
    endDate: zod_1.z
        .string()
        .optional()
        .describe("End of date range in ISO 8601 (e.g. '2026-03-31'). Defaults to 7 days from now."),
    maxResults: zod_1.z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(constants_js_1.DEFAULT_MAX_RESULTS)
        .describe("Maximum number of events to return (1-100, default: 10)"),
    query: zod_1.z
        .string()
        .optional()
        .describe("Free-text search query to filter events by title or description"),
    calendarId: zod_1.z
        .string()
        .default("primary")
        .describe("Calendar ID to list events from (default: 'primary')"),
}).strict();
exports.GetEventSchema = zod_1.z.object({
    eventId: zod_1.z
        .string()
        .min(1, "Event ID is required")
        .describe("The unique event ID from Google Calendar"),
    calendarId: zod_1.z
        .string()
        .default("primary")
        .describe("Calendar ID (default: 'primary')"),
}).strict();
exports.UpdateEventSchema = zod_1.z.object({
    eventId: zod_1.z
        .string()
        .min(1, "Event ID is required")
        .describe("The unique event ID to update"),
    title: zod_1.z.string().max(500).optional().describe("New title for the event"),
    startTime: zod_1.z.string().optional().describe("New start time in ISO 8601"),
    endTime: zod_1.z.string().optional().describe("New end time in ISO 8601"),
    attendees: zod_1.z
        .array(zod_1.z.string().email())
        .optional()
        .describe("New list of attendee emails (replaces existing attendees)"),
    description: zod_1.z.string().max(2000).optional().describe("New description"),
    addMeetLink: zod_1.z
        .boolean()
        .optional()
        .describe("Set to true to add a Google Meet link if not present"),
    timeZone: zod_1.z
        .string()
        .default(constants_js_1.DEFAULT_TIMEZONE)
        .describe("IANA timezone"),
}).strict();
exports.DeleteEventSchema = zod_1.z.object({
    eventId: zod_1.z
        .string()
        .min(1, "Event ID is required")
        .describe("The unique event ID to delete/cancel"),
    calendarId: zod_1.z
        .string()
        .default("primary")
        .describe("Calendar ID (default: 'primary')"),
}).strict();
exports.FreeBusySchema = zod_1.z.object({
    emails: zod_1.z
        .array(zod_1.z.string().email())
        .min(1)
        .max(10)
        .describe("List of email addresses to check availability for"),
    startTime: zod_1.z
        .string()
        .describe("Start of time range in ISO 8601 (e.g. '2026-03-10T09:00:00')"),
    endTime: zod_1.z
        .string()
        .describe("End of time range in ISO 8601 (e.g. '2026-03-10T18:00:00')"),
}).strict();
exports.AuthenticateSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(1, "Authorization code is required")
        .describe("The authorization code from the Google OAuth redirect URL. " +
        "After visiting the auth URL, copy the 'code' parameter from the redirect."),
}).strict();
exports.ListCalendarsSchema = zod_1.z.object({
    maxResults: zod_1.z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20)
        .describe("Maximum number of calendars to return"),
}).strict();
//# sourceMappingURL=index.js.map