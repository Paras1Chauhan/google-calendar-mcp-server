import { calendar_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import type { CalendarEvent } from "../types.js";
export declare function createOAuth2Client(): OAuth2Client;
export declare function getAuthUrl(oauth2Client: OAuth2Client): string;
export declare function getTokenFromCode(oauth2Client: OAuth2Client, code: string): Promise<void>;
export declare function loadSavedToken(oauth2Client: OAuth2Client): boolean;
export declare function getCalendarClient(auth: OAuth2Client): calendar_v3.Calendar;
export declare function formatEvent(event: calendar_v3.Schema$Event): CalendarEvent;
export declare function formatEventMarkdown(event: CalendarEvent): string;
export declare function getAuthenticatedCalendar(): Promise<calendar_v3.Calendar>;
//# sourceMappingURL=calendarService.d.ts.map