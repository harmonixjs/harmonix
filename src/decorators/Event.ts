import 'reflect-metadata';
import { Events } from "discord.js";

export function Event(event: string|Events): ClassDecorator {
    return function (target: any) {
        const prototype = target.prototype;

        if (typeof prototype.execute !== 'function') {
            throw new TypeError(
                `@Event decorator requires an 'execute' method in class ${target.name}\n\n` +
                'Example:\n' +
                '@Event(Events.GuildMemberAdd)\n' +
                'export default class NewMember implement EventExecutor {\n' +
                '  async execute(bot: Bot, member: GuildMember) {\n' +
                '    // Your code\n' +
                '  }\n' +
                '}'
            );
        }

        Reflect.defineMetadata('event:event', event, target);

        return target;
    };
}