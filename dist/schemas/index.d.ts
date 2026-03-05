import { z } from "zod";
export declare const CreateMeetingSchema: z.ZodObject<{
    title: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    attendees: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    addMeetLink: z.ZodDefault<z.ZodBoolean>;
    timeZone: z.ZodDefault<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    title: string;
    startTime: string;
    endTime: string;
    attendees: string[];
    addMeetLink: boolean;
    timeZone: string;
    description?: string | undefined;
    location?: string | undefined;
}, {
    title: string;
    startTime: string;
    endTime: string;
    attendees?: string[] | undefined;
    description?: string | undefined;
    location?: string | undefined;
    addMeetLink?: boolean | undefined;
    timeZone?: string | undefined;
}>;
export declare const ListEventsSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    maxResults: z.ZodDefault<z.ZodNumber>;
    query: z.ZodOptional<z.ZodString>;
    calendarId: z.ZodDefault<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    maxResults: number;
    calendarId: string;
    startDate?: string | undefined;
    endDate?: string | undefined;
    query?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
    maxResults?: number | undefined;
    query?: string | undefined;
    calendarId?: string | undefined;
}>;
export declare const GetEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    calendarId: z.ZodDefault<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    calendarId: string;
    eventId: string;
}, {
    eventId: string;
    calendarId?: string | undefined;
}>;
export declare const UpdateEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    attendees: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    description: z.ZodOptional<z.ZodString>;
    addMeetLink: z.ZodOptional<z.ZodBoolean>;
    timeZone: z.ZodDefault<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    timeZone: string;
    eventId: string;
    title?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    attendees?: string[] | undefined;
    description?: string | undefined;
    addMeetLink?: boolean | undefined;
}, {
    eventId: string;
    title?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    attendees?: string[] | undefined;
    description?: string | undefined;
    addMeetLink?: boolean | undefined;
    timeZone?: string | undefined;
}>;
export declare const DeleteEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    calendarId: z.ZodDefault<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    calendarId: string;
    eventId: string;
}, {
    eventId: string;
    calendarId?: string | undefined;
}>;
export declare const FreeBusySchema: z.ZodObject<{
    emails: z.ZodArray<z.ZodString, "many">;
    startTime: z.ZodString;
    endTime: z.ZodString;
}, "strict", z.ZodTypeAny, {
    startTime: string;
    endTime: string;
    emails: string[];
}, {
    startTime: string;
    endTime: string;
    emails: string[];
}>;
export declare const AuthenticateSchema: z.ZodObject<{
    code: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
export declare const ListCalendarsSchema: z.ZodObject<{
    maxResults: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    maxResults: number;
}, {
    maxResults?: number | undefined;
}>;
//# sourceMappingURL=index.d.ts.map