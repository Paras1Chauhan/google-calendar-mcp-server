# 🗓️ Google Calendar MCP Server

A powerful **Model Context Protocol (MCP)** server that integrates Google Calendar with Claude AI — allowing you to manage your calendar using natural language.

[![npm version](https://img.shields.io/npm/v/google-calendar-mcp-server-paras.svg)](https://www.npmjs.com/package/google-calendar-mcp-server-paras)
[![Docker](https://img.shields.io/docker/pulls/paras7409/google-calendar-mcp-server.svg)](https://hub.docker.com/r/paras7409/google-calendar-mcp-server)
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

## 🚀 Step 2 — Choose your setup method

### Option A — Using npx (easiest) ✅
> No installation needed — just Node.js required

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

Restart Claude Desktop and you're done! ✅

---

### Option B — Using Docker 🐳
> No Node.js or npm needed — just Docker required

**Step 1 — Install Docker Desktop**
Download from 👉 https://www.docker.com/products/docker-desktop

**Step 2 — Pull the image**
```bash
docker pull paras7409/google-calendar-mcp-server
```

**Step 3 — Run the server**

Windows (PowerShell):
```powershell
docker run -p 3000:3000 -e GOOGLE_CLIENT_ID=your-client-id -e GOOGLE_CLIENT_SECRET=your-client-secret -e GOOGLE_REDIRECT_URI=http://localhost:3000/callback paras7409/google-calendar-mcp-server
```

Mac / Linux:
```bash
docker run -p 3000:3000 \
  -e GOOGLE_CLIENT_ID=your-client-id \
  -e GOOGLE_CLIENT_SECRET=your-client-secret \
  -e GOOGLE_REDIRECT_URI=http://localhost:3000/callback \
  paras7409/google-calendar-mcp-server
```

You should see:
```
🗓️ Google Calendar MCP Server running at http://localhost:3000/mcp
```

**Step 4 — Add to Claude Desktop config**

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

**Step 5 — Restart Claude Desktop** ✅

---

## Which option should I choose?

| | npx | Docker |
|---|---|---|
| Requires Node.js | ✅ Yes | ❌ No |
| Requires Docker | ❌ No | ✅ Yes |
| Easiest for developers | ⭐ | |
| Easiest for non-developers | | ⭐ |

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

## 🔗 Links

- 📦 npm: https://www.npmjs.com/package/google-calendar-mcp-server-paras
- 🐳 Docker: https://hub.docker.com/r/paras7409/google-calendar-mcp-server
- 💻 GitHub: https://github.com/Paras1Chauhan/google-calendar-mcp-server

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