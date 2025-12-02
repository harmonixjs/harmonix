import { ButtonInteraction, CacheType } from "discord.js";
import { Harmonix, Component, ComponentContext } from "../../src";
import { ComponentExecutor } from "../../src/executors/ComponentExecutor";

@Component({
    id: "test_button"
})
export default class TestButton implements ComponentExecutor<ButtonInteraction> {
    execute(bot: Harmonix, ctx: ComponentContext<ButtonInteraction<CacheType>>) {
        ctx.reply("Test button clicked!");
    }
}