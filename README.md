# 🗓️ Google Calendar MCP Server

A powerful **Model Context Protocol (MCP)** server that integrates Google Calendar with Claude AI — allowing you to manage your calendar using natural language.

[![npm version](https://img.shields.io/npm/v/google-calendar-mcp-server-paras.svg)](https://www.npmjs.com/package/google-calendar-mcp-server-paras)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## ✨ Features

- 📅 **List Events** — View upcoming events with full details
- ➕ **Create Events** — Schedule meetings with titles, locations, and attendees
- ✏️ **Update Events** — Modify existing events easily
- 🗑️ **Delete Events** — Remove events from your calendar
- 📆 **Multiple Calendars** — Support for all your Google Calendars
- 🔐 **Secure Auth** — OAuth 2.0 authentication with Google

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- A [Google Cloud Platform](https://console.cloud.google.com) account
- Google Calendar API enabled
- OAuth 2.0 credentials

---

## 🔑 Step 1 — Get Google API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a **new project**
3. Go to **APIs & Services** → **Enable APIs** → Enable **Google Calendar API**
4. Go to **APIs & Services** → **Credentials**
5. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
6. Choose **"Web Application"** as the application type
7. Add `http://localhost:3000/callback` to **Authorized Redirect URIs**
8. Click **Create** and copy your:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

## 🚀 Step 2 — Add to Claude Desktop

Open your Claude Desktop config file:

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "google-calendar-mcp-server-paras"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-client-id-here",
        "GOOGLE_CLIENT_SECRET": "your-client-secret-here",
        "GOOGLE_REDIRECT_URI": "http://localhost:3000/callback"
      }
    }
  }
}
```

---

## Step 3 — Restart Claude Desktop

That's it! No installation needed — `npx` handles everything automatically. ✅

---

## 💬 Usage Examples

Once set up, just talk to Claude naturally:

**Listing Events**
> "Show me my upcoming events"
> "What's on my calendar this week?"
> "List all events for tomorrow"

**Creating Events**
> "Schedule a meeting with John tomorrow at 2pm"
> "Create a team lunch next Friday at 12pm"
> "Add a doctor's appointment on Monday at 10am"

**Updating Events**
> "Move my 2pm meeting to 3pm"
> "Add Sarah to tomorrow's team meeting"
> "Update the location of Friday's meeting to Zoom"

**Deleting Events**
> "Cancel my 3pm meeting today"
> "Remove the team lunch from next Friday"

---

## 🔧 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret | `GOCSPX-xxxxx` |
| `GOOGLE_REDIRECT_URI` | OAuth Redirect URI | `http://localhost:3000/callback` |

---

## 🛡️ Security

- All credentials are stored securely via environment variables
- OAuth 2.0 ensures secure access to Google Calendar
- No credentials are ever committed to version control

---

## 🤝 Contributing

Contributions are welcome! Feel free to open a Pull Request or Issue.

---

## 📄 License

ISC © [paras0511](https://www.npmjs.com/~paras0511)