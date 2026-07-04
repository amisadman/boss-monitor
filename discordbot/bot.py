import os
import requests
import discord
from discord.ext import commands, tasks
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime


load_dotenv()
#env ref
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
BACKEND_URL = os.getenv("BACKEND_URL").rstrip("/")

#dc channels
ALERT_CHANNEL_ID_1 = int(os.getenv("ALERT_CHANNEL_ID"))
ALERT_CHANNEL_ID_2 = int(os.getenv("ALERT_CHANNEL_ID_2"))

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# dc bot setup
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# alerts tracking
notified_alert_ids = set()


ROOM_DISPLAY_NAMES = {
    "DrawingRoom": "Drawing Room",
    "WorkRoom1": "Work Room 1",
    "WorkRoom2": "Work Room 2",
}


_ROOM_KEY_LOOKUP = {key.lower(): key for key in ROOM_DISPLAY_NAMES}


def resolve_room_key(user_input: str) -> str:
    """Maps whatever casing/spacing the user typed to the backend's EXACT-cased room key."""
    normalized = user_input.lower().strip().replace(" ", "")
    return _ROOM_KEY_LOOKUP.get(normalized, user_input.strip())


def display_room_name(room_key: str) -> str:
    """Returns the friendly display name for a room key, falling back to title-case."""
    exact_key = _ROOM_KEY_LOOKUP.get(room_key.lower().strip())
    if exact_key:
        return ROOM_DISPLAY_NAMES[exact_key]
    return room_key.title()



EMBED_COLORS = {
    "status": discord.Color.blue(),
    "room": discord.Color.purple(),
    "usage": discord.Color.gold(),
    "time": discord.Color.teal(),
    "alert": discord.Color.red(),
    "error": discord.Color.dark_red(),
}


def build_embed(title: str, description: str, color_key: str, footer: str = None) -> discord.Embed:
    """Builds a consistently styled embed so responses get a colored side-bar in Discord."""
    embed = discord.Embed(title=title, description=description, color=EMBED_COLORS.get(color_key, discord.Color.greyple()))
    if footer:
        embed.set_footer(text=footer)
    return embed


def get_simulated_time_context(usage_payload: dict) -> dict:
    """Parses the usage payload's simulatedTime into a consistent set of fields."""
    simulated_time_str = usage_payload.get("simulatedTime")
    if not simulated_time_str:
        return None

    clean_time_str = simulated_time_str.replace("Z", "+00:00")
    dt = datetime.fromisoformat(clean_time_str)

    simulated_hour = dt.hour
    is_after_hours = simulated_hour < 9 or simulated_hour >= 17

    return {
        "simulated_time_str": simulated_time_str,
        "formatted_clock": dt.strftime("%I:%M %p"),
        "formatted_date": dt.strftime("%A, %B %d, %Y"),
        "simulated_hour": simulated_hour,
        "is_after_hours": is_after_hours,
        "shift_label": "After Hours" if is_after_hours else "Working Hours",
    }


def normalize_per_room_watts(raw) -> dict:
    """Normalizes the backend's perRoomWatts field into a plain {room_key: watts} dict."""
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, list):
        result = {}
        for entry in raw:
            key = entry.get("room") or entry.get("name")
            watts = entry.get("watts", entry.get("totalWatts", entry.get("value", 0)))
            if key is not None:
                result[key] = watts
        return result
    return {}



def humanize_response(summary_context: str, user_query: str, fallback_text: str, allow_closing_comment: bool = False) -> str:
    """Passes a lightweight context to Groq for user commands."""
    try:
        closing_comment_rule = (
            "After the bullet points, add exactly one short closing line addressing the boss "
            "directly (start it with 'Boss,') that gives a brief one-sentence overview summarizing "
            "the data just presented above — use only exact figures already given, nothing invented. "
            if allow_closing_comment else
            "Do not add any closing remark, recommendation, or commentary after the bullet points. "
        )

        chat_completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a polished executive assistant reporting to the boss on Discord. "
                        "Output ONLY the bullet points (using '•') needed to answer the boss's request "
                        "directly — one bullet per metric, nothing else. No headline or title, no intro "
                        "sentence, no filler. " + closing_comment_rule +
                        "Use the 🌀 emoji whenever you mention fans, and the 💡 emoji whenever you "
                        "mention lights — these are the only two emojis you may use, and use each "
                        "exactly once per relevant bullet point. Always place the emoji immediately "
                        "BEFORE the number it describes, e.g. '🌀 3 fans ON', never '3 fans ON 🌀'. "
                        "Keep each bullet as short as possible while staying clear. "
                        "Do not include code block markdown like ``` or backticks. "
                        "Never use a dollar sign ($) anywhere. Watt figures have no currency symbol "
                        "at all — just the number followed by W. Only cost figures use ৳, and only if "
                        "the data already includes ৳. "
                        "Strictly use the exact numbers given; never invent or extrapolate metrics."
                    )
                },
                {
                    "role": "user",
                    "content": f"Office Metrics Summary:\n{summary_context}\n\nBoss request: {user_query}"
                }
            ],
            temperature=0.3,
            max_tokens=150
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"⚠️ Groq Core Error (Using backup template): {e}")
        return fallback_text


# onready run
@bot.event
async def on_ready():
    print(f"🤖 Connected successfully as {bot.user}")
    if not check_backend_alerts.is_running():
        check_backend_alerts.start()


#simulated time stuff
@bot.command(name="time")
async def time(ctx):
    async with ctx.typing():
        try:
            response = requests.get(f"{BACKEND_URL}/api/usage", timeout=5)
            response.raise_for_status()

            usage_payload = response.json()["data"]
            time_ctx = get_simulated_time_context(usage_payload)

            if not time_ctx:
                missing_embed = build_embed("🕒 Time Unavailable", "Boss, the simulated time value is currently unavailable on the backend.", "error")
                await ctx.send(embed=missing_embed)
                return

            status_icon = "🌙 After Hours" if time_ctx["is_after_hours"] else "☀️ Working Hours"

            
            time_body = (
                f"• **Time:** {time_ctx['formatted_clock']}\n"
                f"• **Date:** {time_ctx['formatted_date']}\n"
                f"• **Shift Mode:** {status_icon} (Hour: {time_ctx['simulated_hour']})"
            )

            embed = build_embed("⏰ Current Simulated System Time", time_body, "time")
            await ctx.send(embed=embed)

        except Exception as e:
            print(f"Error on !time: {e}")
            error_embed = build_embed("❌ Time Lookup Failed", "Boss, I couldn't fetch the simulated time frame from the telemetry core.", "error")
            await ctx.send(embed=error_embed)


# status related
@bot.command(name="status")
async def status(ctx):
    async with ctx.typing():
        try:
            devices_response = requests.get(f"{BACKEND_URL}/api/devices", timeout=5)
            devices_response.raise_for_status()
            devices = devices_response.json()["data"]

            usage_response = requests.get(f"{BACKEND_URL}/api/usage", timeout=5)
            usage_response.raise_for_status()
            usage_payload = usage_response.json()["data"]

            total_power = usage_payload.get("totalWattsNow", 0)
            time_ctx = get_simulated_time_context(usage_payload)

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

            summary = f"- Total power consumption right now: {total_power}W.\n"
            fallback_list = [f"**Total Power**\n• ⚡ {total_power}W"]

            total_devices_on = 0
            for room, counts in room_stats.items():
                friendly_name = display_room_name(room)
                total_devices_on += counts["fans"] + counts["lights"]
                line = f"{friendly_name}: {counts['fans']} fan(s) ON, {counts['lights']} light(s) ON."
                summary += f"- {line}\n"
                fallback_list.append(
                    f"**{friendly_name}**\n"
                    f"• 🌀 {counts['fans']} fan(s) ON\n"
                    f"• 💡 {counts['lights']} light(s) ON"
                )

            summary += f"- Total devices currently on across all rooms: {total_devices_on}.\n"
            fallback_lines = ["\n\n".join(fallback_list)]

            if time_ctx:
                summary += (
                    f"- Current simulated time: {time_ctx['formatted_clock']} on {time_ctx['formatted_date']}. "
                    f"Shift status: {time_ctx['shift_label']} (hour {time_ctx['simulated_hour']}).\n"
                )
                fallback_lines.append(
                    f"Boss, power consumption is {total_power}W with {total_devices_on} device(s) on, "
                    f"and it's currently {time_ctx['shift_label']}."
                )

            fallback_text = "\n\n".join(fallback_lines)
            ai_reply = humanize_response(
                summary,
                "Give me a breakdown of the overall office status.",
                fallback_text,
                allow_closing_comment=True
            )

            embed = build_embed("🏢 Office Status Overview", ai_reply, "status")
            await ctx.send(embed=embed)

        except Exception as e:
            print(f"Error on !status: {e}")
            error_embed = build_embed("❌ Status Check Failed", "Boss, I can't reach the backend API server right now.", "error")
            await ctx.send(embed=error_embed)


# room related
@bot.command(name="room")
async def room(ctx, *, name: str = None):
    if not name:
        hint_embed = build_embed("📍 Room Required", "Boss, please specify a target location scope (e.g. `!room WorkRoom1`).", "error")
        await ctx.send(embed=hint_embed)
        return

    async with ctx.typing():
        try:
            clean_name = resolve_room_key(name)
            friendly_name = display_room_name(clean_name)

            response = requests.get(f"{BACKEND_URL}/api/devices/rooms/{clean_name}", timeout=5)
            response.raise_for_status()

            devices = response.json()["data"]

            if len(devices) == 0:
                not_found_embed = build_embed("🔍 Room Not Found", f"No room named **{friendly_name}** found.", "error")
                await ctx.send(embed=not_found_embed)
                return

            on_fans = sum(1 for d in devices if d.get("type") == "fan" and d.get("status") == "on")
            on_lights = sum(1 for d in devices if d.get("type") == "light" and d.get("status") == "on")

            summary = f"Room: {friendly_name}\nActive configurations: {on_fans} fans and {on_lights} lights are turned on."
            fallback_text = (
                f"• 🌀 {on_fans} fan(s) ON\n"
                f"• 💡 {on_lights} light(s) ON\n\n"
                f"Boss, {friendly_name} currently has {on_fans} fan(s) and {on_lights} light(s) running."
            )

            ai_reply = humanize_response(
                summary,
                f"Give me details on the status of {friendly_name}.",
                fallback_text,
                allow_closing_comment=True
            )

            embed = build_embed(f"📍 {friendly_name} Status", ai_reply, "room")
            await ctx.send(embed=embed)

        except Exception as e:
            print(f"Error on !room: {e}")
            error_embed = build_embed("❌ Room Lookup Failed", f"Could not retrieve metrics details for room scope target '{name}'.", "error")
            await ctx.send(embed=error_embed)


# usage related
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
            per_room_watts = normalize_per_room_watts(usage_data.get("perRoomWatts", {}))

            summary = (
                f"Telemetry: Current total load is {live_w}W. Estimated daily energy footprint is "
                f"{daily_kwh} kWh. Total cost today is ৳{cost_today}."
            )
            fallback_list = [
                f"⚡ Current Power: **{live_w}W**\n"
                f"📈 Today's Usage: **{daily_kwh} kWh**\n"
                f"💰 Today's Cost: **৳{cost_today}**"
            ]

            if per_room_watts:
                room_lines = []
                for room_key, watts in per_room_watts.items():
                    friendly_name = display_room_name(room_key)
                    summary += f"\nPer-room draw: {friendly_name} is using {watts}W."
                    room_lines.append(f"• {friendly_name}: **{watts}W**")
                fallback_list.append("**Per-Room Breakdown**\n" + "\n".join(room_lines))

            fallback_text = "\n\n".join(fallback_list)
            fallback_text += (
                f"\n\nBoss, we're currently drawing {live_w}W, which comes to ৳{cost_today} so far today."
            )

            ai_reply = humanize_response(
                summary,
                "What is our current energy utilization draw and cost, broken down by room?",
                fallback_text,
                allow_closing_comment=True
            )

            embed = build_embed("⚡ Energy Usage Report", ai_reply, "usage")
            await ctx.send(embed=embed)

        except Exception as e:
            print(f"Error on !usage: {e}")
            error_embed = build_embed("❌ Usage Query Failed", "Failed to query load balancing metrics from the API interface core.", "error")
            await ctx.send(embed=error_embed)


@bot.command()
async def helpme(ctx):
    help_body = (
        "`!status` - Show office status\n"
        "`!room DrawingRoom` - Show Drawing Room status\n"
        "`!room WorkRoom1` - Show Work Room 1 status\n"
        "`!room WorkRoom2` - Show Work Room 2 status\n"
        "`!usage` - Show power usage\n"
        "`!time` - Show simulated time"
    )
    embed = build_embed("📖 Available Commands", help_body, "time")
    await ctx.send(embed=embed)



@tasks.loop(seconds=45)
async def check_backend_alerts():
    try:
        
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

        #debug related
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

        
        response = requests.get(f"{BACKEND_URL}/api/alerts", timeout=5)
        response.raise_for_status()

        alerts = response.json()["data"]

        active_alerts_count = 0
        alerted_rooms = {}  

        for alert in alerts:

            alert_id = alert.get("_id")

            if (
                alert.get("resolvedAt") is None
                and not alert.get("notifiedDiscord", False)
                and alert_id not in notified_alert_ids
            ):

                active_alerts_count += 1

                room_key = alert.get("scope", "Unknown")
                alerted_rooms[room_key] = True

                notified_alert_ids.add(alert_id)

                try:
                    requests.patch(
                        f"{BACKEND_URL}/api/alerts/{alert_id}/ack",
                        json={"notifiedDiscord": True},
                        timeout=3
                    )
                except Exception:
                    pass

        if alerted_rooms:

            
            devices_res = requests.get(f"{BACKEND_URL}/api/devices", timeout=5)
            devices_res.raise_for_status()
            devices = devices_res.json()["data"]

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

            casual_lines = []
            for room_key in alerted_rooms:
                friendly_name = display_room_name(room_key)
                counts = room_stats.get(room_key, {"fans": 0, "lights": 0})
                casual_lines.append(
                    f"Hey! **{friendly_name}** still has 🌀 {counts['fans']} fan(s) and 💡 {counts['lights']} "
                    f"light(s) ON and it's {formatted_display_time}. Did someone forget to leave?"
                )

            embed_description = "\n\n".join(casual_lines)

            alert_embed = build_embed("🚨 Office Check-In", embed_description, "alert")
            await target_channel.send(embed=alert_embed)

            print(f"📡 Dispatched ({active_alerts_count}) pending notification frames successfully.")

        else:
            print("💤 Check Complete: No new alert frames detected.")

        print("=" * 50 + "\n")

    except Exception as e:
        print(f"\n❌ Error handling pipeline execution routine: {e}\n")

# check bot status if ready or not
@check_backend_alerts.before_loop
async def before_alerts():
    await bot.wait_until_ready()



if __name__ == "__main__":
    bot.run(DISCORD_TOKEN)