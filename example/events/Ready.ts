import { Client, Events } from "discord.js";
import { Harmonix, Event, EventExecutor } from "../../src";

@Event(Events.ClientReady)
export default class ClientReady implements EventExecutor<Events.ClientReady> {
    execute(bot: Harmonix, client: Client<true>) {
        bot.logger.sendLog("SUCCESS", `Bot is ready! Logged in as ${client.user.tag}`);
    }
}