import os
import requests
import discord
from discord.ext import commands, tasks
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
BACKEND_URL = os.getenv("BACKEND_URL").rstrip("/")

# Hardcoded and env-assigned channel IDs
ALERT_CHANNEL_ID_1 = int(os.getenv("ALERT_CHANNEL_ID"))
ALERT_CHANNEL_ID_2 = int(os.getenv("ALERT_CHANNEL_ID_2"))

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# Discord bot setup
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# Prevent duplicate alerts
notified_alert_ids = set()

# --- 🏷️ Room key -> display name mapping ---
ROOM_DISPLAY_NAMES = {
    "drawing": "Drawing Room",
    "work1": "Work Room 1",
    "work2": "Work Room 2",
}


def display_room_name(room_key: str) -> str:
    """Returns the friendly display name for a room key, falling back to title-case."""
    return ROOM_DISPLAY_NAMES.get(room_key.lower().strip(), room_key.title())


# --- 🧠 Groq / Fallback Engine (For standard commands) ---
def humanize_response(summary_context: str, user_query: str, fallback_text: str) -> str:
    """Passes a lightweight context to Groq for user commands."""
    try:
        chat_completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a polished executive assistant reporting to the boss on Discord. "
                        "Write a clean, professional status update formatted for Discord markdown. "
                        "Structure your reply with a short bolded headline, followed by clearly organized "
                        "bullet points (using '•') for each key metric. Keep the tone confident, courteous, "
                        "and concise — no filler, no slang, no emojis in the body text. "
                        "Do not include code block markdown like ``` or backticks. "
                        "Strictly use the exact numbers and currency symbols given; never invent or "
                        "extrapolate metrics."
                    )
                },
                {
                    "role": "user",
                    "content": f"Office Metrics Summary:\n{summary_context}\n\nBoss request: {user_query}"
                }
            ],
            temperature=0.4,
            max_tokens=200
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"⚠️ Groq Core Error (Using backup template): {e}")
        return f"**Office Update** (offline fallback)\n{fallback_text}"


# Runs once when the bot connects
@bot.event
async def on_ready():
    print(f"🤖 Connected successfully as {bot.user}")
    if not check_backend_alerts.is_running():
        check_backend_alerts.start()


# Show simulated system time
@bot.command(name="time")
async def time(ctx):
    async with ctx.typing():
        try:
            response = requests.get(f"{BACKEND_URL}/api/usage", timeout=5)
            response.raise_for_status()

            usage_payload = response.json()["data"]
            simulated_time_str = usage_payload.get("simulatedTime")

            if not simulated_time_str:
                await ctx.send("🕒 Boss, the simulated time value is currently unavailable on the backend.")
                return

            # Clean and parse the ISO format string
            clean_time_str = simulated_time_str.replace("Z", "+00:00")
            dt = datetime.fromisoformat(clean_time_str)

            # Format nicely for the output message
            formatted_date = dt.strftime("%A, %B %d, %Y")
            formatted_clock = dt.strftime("%I:%M %p")
            simulated_hour = dt.hour

            is_after_hours = simulated_hour < 9 or simulated_hour >= 17
            status_icon = "🌙 After Hours" if is_after_hours else "☀️ Working Hours"

            # Create the final clean display block
            time_message = (
                f"⏰ **Current Simulated System Time**\n"
                f"• **Time:** {formatted_clock}\n"
                f"• **Date:** {formatted_date}\n"
                f"• **Shift Mode:** {status_icon} (Hour: {simulated_hour})"
            )

            await ctx.send(time_message)

        except Exception as e:
            print(f"Error on !time: {e}")
            await ctx.send("❌ Boss, I couldn't fetch the simulated time frame from the telemetry core.")


# Show office status
@bot.command(name="status")
async def status(ctx):
    async with ctx.typing():
        try:
            response = requests.get(f"{BACKEND_URL}/api/devices", timeout=5)
            response.raise_for_status()

            devices = response.json()["data"]
            room_stats = {}

            for d in devices:
                room = d.get("room", "unknown")
                if room not in room_stats:
                    room_stats[room] = {"fans": 0, "lights": 0}

                if d.get("status") == "on":
                    if d.get("type") == "fan":
                        room_stats[room]["fans"] += 1
                    elif d.get("type") == "light":
                        room_stats[room]["lights"] += 1

            summary = ""
            fallback_list = []
            for room, counts in room_stats.items():
                friendly_name = display_room_name(room)
                line = f"{friendly_name}: {counts['fans']} fan(s) ON, {counts['lights']} light(s) ON."
                summary += f"- {line}\n"
                fallback_list.append(
                    f"**{friendly_name}**\n"
                    f"• 🌀 Fans: {counts['fans']}\n"
                    f"• 💡 Lights: {counts['lights']}"
                )

            fallback_text = "\n\n".join(fallback_list)
            ai_reply = humanize_response(summary, "Give me a breakdown of the overall office status.", fallback_text)
            await ctx.send(ai_reply)

        except Exception as e:
            print(f"Error on !status: {e}")
            await ctx.send("❌ Boss, I can't reach the backend API server right now.")


# Show status for one room
@bot.command(name="room")
async def room(ctx, *, name: str = None):
    if not name:
        await ctx.send("Boss, please specify a target location scope (e.g. `!room work1`).")
        return

    async with ctx.typing():
        try:
            clean_name = name.lower().strip()
            friendly_name = display_room_name(clean_name)

            response = requests.get(f"{BACKEND_URL}/api/devices/rooms/{clean_name}", timeout=5)
            response.raise_for_status()

            devices = response.json()["data"]

            if len(devices) == 0:
                await ctx.send(f"No room named **{friendly_name}** found.")
                return

            on_fans = sum(1 for d in devices if d.get("type") == "fan" and d.get("status") == "on")
            on_lights = sum(1 for d in devices if d.get("type") == "light" and d.get("status") == "on")

            summary = f"Room: {friendly_name}\nActive configurations: {on_fans} fans and {on_lights} lights are turned on."
            fallback_text = (
                f"**{friendly_name}**\n"
                f"• 🌀 Fans ON: {on_fans}\n"
                f"• 💡 Lights ON: {on_lights}"
            )

            ai_reply = humanize_response(summary, f"Give me details on the status of {friendly_name}.", fallback_text)
            await ctx.send(ai_reply)

        except Exception as e:
            print(f"Error on !room: {e}")
            await ctx.send(f"❌ Could not retrieve metrics details for room scope target '{name}'.")


# Show energy usage
@bot.command(name="usage")
async def usage(ctx):
    async with ctx.typing():
        try:
            response = requests.get(f"{BACKEND_URL}/api/usage", timeout=5)
            response.raise_for_status()

            usage_data = response.json()["data"]

            live_w = usage_data.get("totalWattsNow", 0)
            daily_kwh = usage_data.get("estimatedKwhToday", 0)
            cost_today = usage_data.get("estimatedCostToday", 0)

            summary = f"Telemetry: Current total load is {live_w}W. Estimated daily energy footprint is {daily_kwh} kWh. Total cost today is ৳{cost_today}."
            fallback_text = (
                f"⚡ Current Power: **{live_w}W**\n"
                f"📈 Today's Usage: **{daily_kwh} kWh**\n"
                f"💰 Today's Cost: **৳{cost_today}**"
            )

            ai_reply = humanize_response(summary, "What is our current energy utilization draw and cost?", fallback_text)
            await ctx.send(ai_reply)

        except Exception as e:
            print(f"Error on !usage: {e}")
            await ctx.send("❌ Failed to query load balancing metrics from the API interface core.")


@bot.command()
async def helpme(ctx):
    await ctx.send("""
**Available Commands**

`!status` - Show office status
`!room work1` - Show room status
`!usage` - Show power usage
`!time` - Show simulated time

""")


# --- 🚨 Time-Aware Alert System (Fixed Routing Engine) ---
@tasks.loop(seconds=45)
async def check_backend_alerts():
    try:
        # 1. Fetch current simulated time from the usage endpoint
        usage_res = requests.get(f"{BACKEND_URL}/api/usage", timeout=5)
        usage_res.raise_for_status()
        usage_payload = usage_res.json()["data"]

        simulated_time_str = usage_payload.get("simulatedTime")

        simulated_hour = 12
        formatted_display_time = "N/A"

        if simulated_time_str:
            clean_time_str = simulated_time_str.replace("Z", "+00:00")
            dt = datetime.fromisoformat(clean_time_str)
            simulated_hour = dt.hour
            formatted_display_time = dt.strftime("%I:%M %p")

        # 2. Determine routing status details
        is_after_hours = simulated_hour < 9 or simulated_hour >= 17
        active_routing_id = (
            ALERT_CHANNEL_ID_2
        )

        target_channel = bot.get_channel(active_routing_id)

        if target_channel is None:
            try:
                target_channel = await bot.fetch_channel(active_routing_id)
                resolution_status = f"Active (Resolved: #{target_channel.name})"
            except discord.errors.NotFound:
                resolution_status = "FAILED (Channel ID does not exist)"
            except discord.errors.Forbidden:
                resolution_status = "FAILED (Missing access permissions)"
            except Exception as ce:
                resolution_status = f"FAILED ({str(ce)})"
        else:
            resolution_status = f"Active (Resolved: #{target_channel.name})"

        # Terminal diagnostics
        print("\n" + "=" * 50)
        print("🕒 BACKEND TELEMETRY TRACKER BUCKET")
        print("=" * 50)
        print(f"• Simulated Time : {simulated_time_str if simulated_time_str else 'Unknown'}")
        print(f"• Parsed Clock   : {formatted_display_time} (Hour: {simulated_hour})")
        print(f"• Operating Mode : {'🌙 AFTER HOURS (9-5 Passed)' if is_after_hours else '☀️ STANDARD WORKING HOURS (9-5)'}")
        print(f"• Routing Target : Channel ID ({active_routing_id}) -> {resolution_status}")
        print("=" * 50)

        if target_channel is None:
            print("⚠️ Skipping alert check loop because target channel is unreachable.")
            print("=" * 50 + "\n")
            return

        # 3. Pull active alerts
        response = requests.get(f"{BACKEND_URL}/api/alerts", timeout=5)
        response.raise_for_status()

        alerts = response.json()["data"]

        active_alerts_count = 0
        alert_lines = []

        for alert in alerts:

            alert_id = alert.get("_id")

            if (
                alert.get("resolvedAt") is None
                and not alert.get("notifiedDiscord", False)
                and alert_id not in notified_alert_ids
            ):

                active_alerts_count += 1

                room_name = display_room_name(alert.get("scope", "Unknown"))
                device_message = alert.get("message", "Unknown Device")

                alert_lines.append(
                    f"🏠 **{room_name}**\n"
                    f"• {device_message}"
                )

                notified_alert_ids.add(alert_id)

                try:
                    requests.patch(
                        f"{BACKEND_URL}/api/alerts/{alert_id}/ack",
                        json={"notifiedDiscord": True},
                        timeout=3
                    )
                except Exception:
                    pass

        if alert_lines:

            final_message = (
                "🚨 **Office Energy Report**\n\n"
                "The following rooms require your attention:\n\n"
                + "\n\n".join(alert_lines)
                + "\n\n"
                "────────────────────────────\n\n"
                "**Recommendation**\n"
                "Please switch off any devices that are no longer in use to minimize unnecessary "
                "energy consumption and maintain efficient office operations.\n\n"
            )

            await target_channel.send(final_message)

            print(f"📡 Dispatched ({active_alerts_count}) pending notification frames successfully.")

        else:
            print("💤 Check Complete: No new alert frames detected.")

        print("=" * 50 + "\n")

    except Exception as e:
        print(f"\n❌ Error handling pipeline execution routine: {e}\n")

# Wait until the bot is ready
@check_backend_alerts.before_loop
async def before_alerts():
    await bot.wait_until_ready()


# Start the bot
if __name__ == "__main__":
    bot.run(DISCORD_TOKEN)