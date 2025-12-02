import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { Harmonix, Command, CommandContext } from "../../src";
import CommandExecutor from "../../src/executors/CommandExecutor";

@Command({
    name: "test",
    description: "A test command",
})
export default class TestCommand implements CommandExecutor<ChatInputCommandInteraction> {
    execute(bot: Harmonix, ctx: CommandContext<ChatInputCommandInteraction<CacheType>>) {
        ctx.reply("Test command executed!");
    }
}