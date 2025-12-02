import 'reflect-metadata';
import { 
    APIApplicationCommandOptionChoice, 
    ApplicationCommandOptionType, 
    PermissionResolvable 
} from 'discord.js';

type CommandType = 'slash' | 'prefix' | 'both';

export interface CommandOptions {
    /**
     * Name of the command (unique identifier)
     */
    name: string;
    /**
     * Description of the command
     */
    description: string;
    /**
     * Type of the command (slash, prefix, both)
     * Default: 'slash'
     */
    type?: CommandType;
    /**
     * Cooldown time in microseconds for the command for each user
     */
    user_cooldown?: number;
    /**
     * Cooldown time in microseconds for the command for each guild
     */
    guild_cooldown?: number;
    /**
     * Permissions requested from the Discord user
     */
    member_permission?: bigint|PermissionResolvable;
    /**
     * Options for the command (slash commands only)
     */
    options?: Options[];

}

export interface Options {
    /**
     * Nom de l'option (ce champ doit être unique)
     */
    name: string;
    /**
     * Desciption de l'option
     */
    description: string;
    /**
     * Type de l'option
     */
    type: number|ApplicationCommandOptionType;
    /**
     * L'option est requise
     */
    required?: boolean;
    /**
     * L'option est une autocompletion (utilisation uniquement si requis call API, sinon utiliser choices)
     */
    autocomplete?: boolean;
    /**
     * Si l'options actuelle est une subcommand alors on peut mettre à nouveau des options
     */
    options?: Options[];
    /**
     * Ajout de choix directement dans l'option
     */
    choices?: APIApplicationCommandOptionChoice<string | number>[];
}


// Define the _Command decorator
export function Command(options: CommandOptions): ClassDecorator {
    return function (target: any) {
        const prototype = target.prototype;

        if (typeof prototype.execute !== 'function') {
            throw new TypeError(
                `@Command decorator requires an 'execute' method in class ${target.name}\n\n` +
                'Example:\n' +
                '@Command({ name: "test", description: "Test command" })\n' +
                'export default class TestCommand implement CommandExecutor<ChatInputCommandInteraction> {\n' +
                '  async execute(bot: Bot, ctx: CommandContext<ChatInputCommandInteraction>) {\n' +
                '    // Your code\n' +
                '  }\n' +
                '}'
            );
        }

        Reflect.defineMetadata('command:options', options, target);
        
        return target;
    };
}