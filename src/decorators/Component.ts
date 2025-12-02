import 'reflect-metadata';
import { PermissionResolvable } from 'discord.js';

export interface ComponentOptions {
    /**
     * Component ID (unique identifier)
     */
    id: string;
    /**
     * Permissions requested from the Discord user
     */
    member_permission?: bigint | PermissionResolvable;
}

export function Component(options: ComponentOptions): ClassDecorator {
    return function (target: any) {
        const prototype = target.prototype;

        if (typeof prototype.execute !== 'function') {
            throw new TypeError(
                `@Component decorator requires an 'execute' method in class ${target.name}\n\n` +
                'Example:\n' +
                '@Component({ id: "test" })\n' +
                'export default class TestButton implement ComponentExecutor<InteractionButton> {\n' +
                '  async execute(bot: Bot, ctx: ComponentContext<InteractionButton>) {\n' +
                '    // Your code\n' +
                '  }\n' +
                '}'
            );
        }

        Reflect.defineMetadata('component:options', options, target);

        return target;
    }
}