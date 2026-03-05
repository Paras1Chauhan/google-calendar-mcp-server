# 🗓️ Google Calendar MCP Server

A Model Context Protocol (MCP) server that lets Claude schedule Google Meet meetings, manage calendar events, and check availability — all through natural language!

---

## ✨ Features

| Tool | Description |
|------|-------------|
| `calendar_authenticate` | One-time Google OAuth 2.0 setup |
| `calendar_create_meeting` | Create events with auto Google Meet links |
| `calendar_list_events` | List upcoming events with filters |
| `calendar_get_event` | Get full details of a specific event |
| `calendar_update_event` | Update title, time, attendees, etc. |
| `calendar_delete_event` | Cancel and notify all attendees |
| `calendar_check_availability` | Check free/busy for multiple people |
| `calendar_list_calendars` | List all your Google Calendars |

---

## 🚀 Setup (Step-by-Step)

### Step 1: Google Cloud Project Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Calendar API**:
   - Go to **APIs & Services → Library**
   - Search "Google Calendar API" → Enable it
4. Create **OAuth 2.0 Credentials**:
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth client ID**
   - Choose **Web application**
   - Add Authorized redirect URI: `http://localhost:3000/oauth2callback`
   - Download credentials JSON

### Step 2: Install & Configure

```bash
# Clone/copy this project
cd google-calendar-mcp-server

# Install dependencies
npm install

# Copy env file and fill in your credentials
cp .env.example .env
# Edit .env with your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

# Build TypeScript
npm run build
```

### Step 3: Configure Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "node",
      "args": ["/absolute/path/to/google-calendar-mcp-server/dist/index.js"],
      "env": {
        "GOOGLE_CLIENT_ID": "your_client_id",
        "GOOGLE_CLIENT_SECRET": "your_client_secret",
        "TRANSPORT": "stdio"
      }
    }
  }
}
```

### Step 4: Authenticate (One Time)

In Claude, say:
> "Authenticate my Google Calendar"

Claude will call `calendar_authenticate` and give you a URL. Open it, sign in, and paste the code back.

---

## 💬 Example Prompts

Once set up, just talk to Claude naturally:

```
"Schedule a team meeting tomorrow at 10am to 11am and add a Google Meet link"

"What meetings do I have this week?"

"Is Sarah (sarah@company.com) free on Friday afternoon?"

"Move the 3pm meeting to 4pm"

"Cancel the Monday standup and notify everyone"

"Show me all meetings with the word 'sprint' in the title"
```

---

## 📁 Project Structure

```
google-calendar-mcp-server/
├── src/
│   ├── index.ts              # Entry point & transport setup
│   ├── types.ts              # TypeScript interfaces
│   ├── constants.ts          # Config constants
│   ├── tools/
│   │   └── calendarTools.ts  # All 8 MCP tools
│   ├── services/
│   │   └── calendarService.ts # Google API client & helpers
│   └── schemas/
│       └── index.ts          # Zod validation schemas
├── dist/                     # Compiled JS (after npm run build)
├── token.json                # Saved OAuth token (auto-created)
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Authentication Flow

```
You → Claude → calendar_authenticate (no code)
           ↓
      Returns Google Auth URL
           ↓
You → Open URL in browser → Sign in with Google
           ↓
      Redirected to localhost:3000/oauth2callback?code=ABC123
           ↓
You → Claude → calendar_authenticate(code="ABC123")
           ↓
      Token saved to token.json ✅
```

---

## 🛠️ Development

```bash
# Run in development mode (with ts-node)
npm run dev

# Build for production
npm run build

# Run built server
npm start

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 🌍 Timezone

Default timezone is set to `Asia/Kolkata` (IST). You can override per-request using the `timeZone` parameter.

---

## 📋 Requirements

- Node.js 18+
- Google Cloud account (free tier is fine)
- Claude Desktop app