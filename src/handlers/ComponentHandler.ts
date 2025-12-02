import { Harmonix } from "../client/Bot";
import fs, { statSync } from "fs";
import { join, resolve } from "path";
import chalk from "chalk";
import 'reflect-metadata';
import { ComponentOptions } from "../decorators/Component";
import { ComponentExecutor } from "../executors/ComponentExecutor";

export default function RegisterComponent(bot: Harmonix, dir: string) {
    const userDir = resolve(process.cwd(), dir);
    loadComponent(bot, userDir)
}

function loadComponent(bot: Harmonix, dir: string) {
    fs.readdirSync(dir).forEach(async file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            loadComponent(bot, filePath);
            return;
        }

        if (!file.endsWith(".js") && !file.endsWith(".ts")) return;

        const ComponentClass = (await import(filePath)).default;

        const componentOptions: ComponentOptions = Reflect.getMetadata(
            "component:options", 
            ComponentClass
        );

        if (!componentOptions) {
            console.log(chalk.yellow(`File '${file}' does not have a valid @Component decorator.`));
            return;
        }

        if(!componentOptions.id) {
            console.log(chalk.red(`Component in '${file}' is missing an id!`));
            return;
        }

        const instace: ComponentExecutor = new ComponentClass();

        if(typeof instace.execute !== "function") {
            console.log(chalk.red(`Component '${componentOptions.id}' has no execute() method!`));
            return;
        }

        bot.components.set(componentOptions.id, instace);

        console.log(chalk.green(`Component '${componentOptions.id}' registered.`));
    })
}