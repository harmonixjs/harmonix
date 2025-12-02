import { Harmonix } from "../client/Bot";
import { ComponentContext, ComponentEvent } from "../contexts/ComponentContext";

/**
 * Interface for component executors in Harmonix.
 * Used to handle interactions with components like buttons or selects.
 *
 * @typeParam T - The specific component event type
 */
export interface ComponentExecutor<T extends ComponentEvent = ComponentEvent> {
    /**
     * Executes the component interaction logic.
     * @param bot - The Harmonix bot instance
     * @param ctx - The component interaction context
     */
    execute(bot: Harmonix, ctx: ComponentContext<T>): Promise<any> | any;
}