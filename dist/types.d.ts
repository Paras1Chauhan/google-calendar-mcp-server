export interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    startTime: string;
    endTime: string;
    attendees: Attendee[];
    meetLink?: string;
    status: string;
    htmlLink: string;
    organizer: string;
}
export interface Attendee {
    email: string;
    displayName?: string;
    responseStatus?: string;
}
export interface CreateMeetingInput {
    title: string;
    startTime: string;
    endTime: string;
    attendees?: string[];
    description?: string;
    location?: string;
    addMeetLink: boolean;
    timeZone?: string;
}
export interface ListEventsInput {
    startDate?: string;
    endDate?: string;
    maxResults?: number;
    query?: string;
    calendarId?: string;
}
export interface UpdateEventInput {
    eventId: string;
    title?: string;
    startTime?: string;
    endTime?: string;
    attendees?: string[];
    description?: string;
    addMeetLink?: boolean;
    timeZone?: string;
}
export interface DeleteEventInput {
    eventId: string;
    calendarId?: string;
}
export interface GetEventInput {
    eventId: string;
    calendarId?: string;
}
export interface ListCalendarsInput {
    maxResults?: number;
}
export interface FreeBusyInput {
    emails: string[];
    startTime: string;
    endTime: string;
}
export interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    startTime: string;
    endTime: string;
    attendees: Attendee[];
    meetLink?: string;
    status: string;
    htmlLink: string;
    organizer: string;
}
export interface Attendee {
    email: string;
    displayName?: string;
    responseStatus?: string;
}
export interface CreateMeetingInput {
    title: string;
    startTime: string;
    endTime: string;
    attendees?: string[];
    description?: string;
    location?: string;
    addMeetLink: boolean;
    timeZone?: string;
}
export interface ListEventsInput {
    startDate?: string;
    endDate?: string;
    maxResults?: number;
    query?: string;
    calendarId?: string;
}
export interface UpdateEventInput {
    eventId: string;
    title?: string;
    startTime?: string;
    endTime?: string;
    attendees?: string[];
    description?: string;
    addMeetLink?: boolean;
    timeZone?: string;
}
export interface DeleteEventInput {
    eventId: string;
    calendarId?: string;
}
export interface GetEventInput {
    eventId: string;
    calendarId?: string;
}
export interface ListCalendarsInput {
    maxResults?: number;
}
export interface FreeBusyInput {
    emails: string[];
    startTime: string;
    endTime: string;
}
//# sourceMappingURL=types.d.ts.map