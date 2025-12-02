import { Harmonix } from "../client/Bot";
import { EventExecutor } from "../executors/EventExecutor";
import fs, { statSync } from "fs";
import { join, resolve } from "path";
import chalk from "chalk";
import { ClientEvents } from "discord.js";

export default function RegisterEvents(client: Harmonix, dir: string) {
    const EventDir: string = resolve(process.cwd(), dir);
    const InteractionDir: string = join(__dirname, '..', 'modules');

    loadEvent(client, EventDir);
    loadEvent(client, InteractionDir);
}

function loadEvent(client: Harmonix, dir: string) {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            loadEvent(client, filePath);
            return;
        }

        if (!file.endsWith(".js") && !file.endsWith(".ts")) return;

        const EventClass = require(filePath).default;
        const eventOn: keyof ClientEvents = Reflect.getMetadata("event:event", EventClass);

        if (!eventOn) {
            console.log(chalk.yellow(`File '${file}' does not have a valid Event decorator.`));
            return;
        }

        const eventListenerInstance: EventExecutor<typeof eventOn> = new EventClass();

        client.on(eventOn, async (...args: ClientEvents[typeof eventOn]) => {
            try {
                eventListenerInstance.execute(client, ...args);
            } catch (error) {
                console.error(`Event error '${eventOn}':`, error);
            }
        });

        console.log(chalk.green(`Event '${eventOn}' registered.`));
    });
}