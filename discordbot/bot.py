import os
import json
import discord
from discord.ext import commands, tasks
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
ALERT_CHANNEL_ID = int(os.getenv("ALERT_CHANNEL_ID"))

# Discord bot setup
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# Prevent duplicate alerts
notified_alert_ids = set()


# Load mock device data
def load_devices():
    with open("mockdata/devices.json", "r") as f:
        return json.load(f)["data"]

def load_room():
    with open("mockdata/room_work.json", "r") as f:
        return json.load(f)["data"]

# Load mock usage data
def load_usage():
    with open("mockdata/usage.json", "r") as f:
        return json.load(f)


# Load mock alerts
def load_alerts():
    with open("mockdata/alerts.json", "r") as f:
        return json.load(f)


# Runs once when the bot connects
@bot.event
async def on_ready():
    print(f"🤖 Connected successfully as {bot.user}")

    if not check_backend_alerts.is_running():
        check_backend_alerts.start()


# Show office status
@bot.command(name="status")
async def status(ctx):
    async with ctx.typing():
        try:
            devices = load_devices()

            room_stats = {}

            for d in devices:
                room = d.get("room", "unknown")

                if room not in room_stats:
                    room_stats[room] = {
                        "fans": 0,
                        "lights": 0
                    }

                if d.get("status") == "on":
                    if d.get("type") == "fan":
                        room_stats[room]["fans"] += 1
                    elif d.get("type") == "light":
                        room_stats[room]["lights"] += 1

            message = ""

            for room, counts in room_stats.items():
                message += (
                    f"**{room.title()}**\n"
                    f"🌀 Fans ON: {counts['fans']}\n"
                    f"💡 Lights ON: {counts['lights']}\n\n"
                )

            await ctx.send(message)

        except Exception as e:
            print(e)
            await ctx.send("❌ Failed to load device data.")


# Show status for one room
@bot.command(name="room")
async def room(ctx, *, name: str = None):

    if not name:
        await ctx.send("Usage: `!room kitchen`")
        return

    async with ctx.typing():

        try:
            clean_name = name.lower().strip()

            all_devices = load_devices()

            devices = [
                d for d in all_devices
                if d.get("room", "").lower() == clean_name
            ]

            if len(devices) == 0:
                await ctx.send(f"No room named **{clean_name}** found.")
                return

            on_fans = sum(
                1 for d in devices
                if d.get("type") == "fan"
                and d.get("status") == "on"
            )

            on_lights = sum(
                1 for d in devices
                if d.get("type") == "light"
                and d.get("status") == "on"
            )

            await ctx.send(
                f"**{clean_name.title()}**\n"
                f"🌀 Fans ON: {on_fans}\n"
                f"💡 Lights ON: {on_lights}"
            )

        except Exception as e:
            print(e)
            await ctx.send("❌ Failed to load room data.")


# Show power usage
@bot.command(name="usage")
async def usage(ctx):

    async with ctx.typing():

        try:
            usage_data = load_usage()

            live_w = usage_data.get("power_w", 0)
            daily_kwh = usage_data.get("daily_kwh", 0)

            await ctx.send(
                f"⚡ Current Power: **{live_w}W**\n"
                f"📈 Today's Usage: **{daily_kwh} kWh**"
            )

        except Exception as e:
            print(e)
            await ctx.send("❌ Failed to load usage data.")


# Check alerts every 30 seconds
@tasks.loop(seconds=30)
async def check_backend_alerts():

    channel = bot.get_channel(ALERT_CHANNEL_ID)

    if channel is None:
        return

    try:

        alerts = load_alerts()

        for alert in alerts:

            alert_id = alert.get("_id")

            if (
                alert.get("resolvedAt") is None
                and not alert.get("notifiedDiscord", False)
                and alert_id not in notified_alert_ids
            ):

                await channel.send(
                    f"⚠️ **Live System Alert**\n"
                    f"Type: {alert.get('type')}\n"
                    f"Room: {alert.get('scope')}\n"
                    f"Message: {alert.get('message')}"
                )

                notified_alert_ids.add(alert_id)

    except Exception as e:
        print(e)


# Wait until the bot is ready before starting the alert loop
@check_backend_alerts.before_loop
async def before_alerts():
    await bot.wait_until_ready()


# Start the bot
if __name__ == "__main__":
    bot.run(DISCORD_TOKEN)