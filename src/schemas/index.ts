import { z } from "zod";
import { DEFAULT_MAX_RESULTS, DEFAULT_TIMEZONE } from "../constants.js";

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const CreateMeetingSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(500, "Title too long")
    .describe("Title/summary of the meeting"),

  startTime: z
    .string()
    .describe(
      "Start time in ISO 8601 format (e.g. '2026-03-10T10:00:00'). If no timezone offset is included, timeZone field is used."
    ),

  endTime: z
    .string()
    .describe("End time in ISO 8601 format (e.g. '2026-03-10T11:00:00')"),

  attendees: z
    .array(z.string().email("Must be a valid email address"))
    .optional()
    .default([])
    .describe("List of attendee email addresses to invite"),

  description: z
    .string()
    .max(2000)
    .optional()
    .describe("Optional description or agenda for the meeting"),

  location: z
    .string()
    .max(500)
    .optional()
    .describe("Optional physical or virtual location"),

  addMeetLink: z
    .boolean()
    .default(true)
    .describe("Whether to auto-generate a Google Meet video link (default: true)"),

  timeZone: z
    .string()
    .default(DEFAULT_TIMEZONE)
    .describe(`IANA timezone (e.g. 'Asia/Kolkata', 'America/New_York'). Default: ${DEFAULT_TIMEZONE}`),
}).strict();

export const ListEventsSchema = z.object({
  startDate: z
    .string()
    .optional()
    .describe("Start of date range in ISO 8601 (e.g. '2026-03-01'). Defaults to today."),

  endDate: z
    .string()
    .optional()
    .describe("End of date range in ISO 8601 (e.g. '2026-03-31'). Defaults to 7 days from now."),

  maxResults: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(DEFAULT_MAX_RESULTS)
    .describe("Maximum number of events to return (1-100, default: 10)"),

  query: z
    .string()
    .optional()
    .describe("Free-text search query to filter events by title or description"),

  calendarId: z
    .string()
    .default("primary")
    .describe("Calendar ID to list events from (default: 'primary')"),
}).strict();

export const GetEventSchema = z.object({
  eventId: z
    .string()
    .min(1, "Event ID is required")
    .describe("The unique event ID from Google Calendar"),

  calendarId: z
    .string()
    .default("primary")
    .describe("Calendar ID (default: 'primary')"),
}).strict();

export const UpdateEventSchema = z.object({
  eventId: z
    .string()
    .min(1, "Event ID is required")
    .describe("The unique event ID to update"),

  title: z.string().max(500).optional().describe("New title for the event"),
  startTime: z.string().optional().describe("New start time in ISO 8601"),
  endTime: z.string().optional().describe("New end time in ISO 8601"),

  attendees: z
    .array(z.string().email())
    .optional()
    .describe("New list of attendee emails (replaces existing attendees)"),

  description: z.string().max(2000).optional().describe("New description"),

  addMeetLink: z
    .boolean()
    .optional()
    .describe("Set to true to add a Google Meet link if not present"),

  timeZone: z
    .string()
    .default(DEFAULT_TIMEZONE)
    .describe("IANA timezone"),
}).strict();

export const DeleteEventSchema = z.object({
  eventId: z
    .string()
    .min(1, "Event ID is required")
    .describe("The unique event ID to delete/cancel"),

  calendarId: z
    .string()
    .default("primary")
    .describe("Calendar ID (default: 'primary')"),
}).strict();

export const FreeBusySchema = z.object({
  emails: z
    .array(z.string().email())
    .min(1)
    .max(10)
    .describe("List of email addresses to check availability for"),

  startTime: z
    .string()
    .describe("Start of time range in ISO 8601 (e.g. '2026-03-10T09:00:00')"),

  endTime: z
    .string()
    .describe("End of time range in ISO 8601 (e.g. '2026-03-10T18:00:00')"),
}).strict();

export const AuthenticateSchema = z.object({
  code: z
    .string()
    .min(1, "Authorization code is required")
    .describe(
      "The authorization code from the Google OAuth redirect URL. " +
      "After visiting the auth URL, copy the 'code' parameter from the redirect."
    ),
}).strict();

export const ListCalendarsSchema = z.object({
  maxResults: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("Maximum number of calendars to return"),
}).strict();