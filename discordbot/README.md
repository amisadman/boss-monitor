# Boss Monitor — Discord Bot

A conversational Discord Bot built using Python and the `discord.py` API. The bot integrates with the **Groq LLM API** to deliver friendly, humanized natural language responses, and connects to the central Express + TypeScript backend to query live device states, power usage, and broadcast proactive alerts.

---

## Features

1.  **AI-Powered Conversational Responses:** Uses Groq's LLM model to turn structured backend stats into natural, friendly chat responses.
2.  **Live Status Querying:** Request status of the entire office or specific rooms directly from Discord.
3.  **Proactive Warning Broadcasts:** Runs a background loop polling the backend alerts engine, automatically posting notifications to designated alert channels when office policy violations are detected.

---

## 1. Installation

From inside the `discordbot/` directory, install the required Python packages using pip:
```bash
pip install -r requirements.txt
```

---

## 2. Configuration (`.env`)

Copy `env.sample` to a new file named `.env` in the same directory:
```bash
cp env.sample .env
```

Open `.env` and fill in the configuration values:
```env
DISCORD_TOKEN="YOUR_DISCORD_BOT_TOKEN"
GROQ_API_KEY="YOUR_GROQ_API_KEY"
BACKEND_URL="https://boss-monitor.onrender.com"
ALERT_CHANNEL_ID="YOUR_DISCORD_CHANNEL_ID_FOR_BOT_COMMANDS"
ALERT_CHANNEL_ID_2="YOUR_DISCORD_CHANNEL_ID_FOR_PROACTIVE_ALERTS"
```

### Where to obtain the keys:
*   **DISCORD_TOKEN:** Create an application on the [Discord Developer Portal](https://discord.com/developers/applications), add a Bot user, and copy the bot's authorization token under the **Bot** tab.
*   **GROQ_API_KEY:** Generate an API key from the [Groq Console](https://console.groq.com/keys).
*   **ALERT_CHANNEL_IDs:** Right-click the respective channels in your Discord server and click **Copy ID** (requires Discord's **Developer Mode** enabled: User Settings → Advanced → Developer Mode).

---

## 3. Invite the Bot to Your Server

Generate an invite link from the Discord Developer Portal under **OAuth2 → URL Generator** with the `bot` scope and `Administrator` or general text permissions, or use the pre-configured link below:

[Invite Boss Monitor Bot](https://discord.com/oauth2/authorize?client_id=1522623621426708652&permissions=8&integration_type=0&scope=bot)

---

## 4. Run the Bot

Start the bot locally:
```bash
python bot.py
```
If it connects successfully, you will see the login confirmation in your terminal:
```
Connected successfully as OfficeAI
```

---

## 5. Available Commands

Type `!helpme` in any text channel the bot has access to, or run these commands directly:

*   **`!status`** — Retrieves a real-time status summary of all active lights and fans across the office.
*   **`!devices`** — Shows total devices and active status
*   **`!room DrawingRoom`** — Shows Drawing Room device states.
*   **`!room WorkRoom1`** — Shows Work Room 1 device states.
*   **`!room WorkRoom2`** — Shows Work Room 2 device states.
*   **`!usage`** — Shows current power draw (Watts) and today's accumulated consumption (kWh).
*   **`!time`** — Displays the current simulated virtual clock time.
*   **`!ask <question>`** — Chat with AI as usual and also replies to any query related to the backend.

---

## 6. Directory Layout

```
discordbot/
├── bot.py             # Main Python bot code & discord event loops
├── requirements.txt   # Package dependencies
├── env.sample         # Configuration template
└── .env               # Active variables (ignored by Git)
```
