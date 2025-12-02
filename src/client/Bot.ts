import {
    Client,
    Collection,
    ClientOptions,
    Snowflake
} from "discord.js"
import { ensureTypeScriptProject, validateTypeScriptConfig } from "../utils/typescript-check";
import RegisterEvents from "../handlers/EventHandler";
import RegisterCommands from "../handlers/CommandHandler";
import RegisterComponent from "../handlers/ComponentHandler";
import { Logger } from "./Logger";

export interface BotConfig extends ClientOptions {
    /**
     * Core bot configuration
     */
    bot: {
        /**
         * The bot's client ID (Snowflake)
         */
        id: Snowflake;

        /**
         * The bot's token for login
         */
        token: string;

        /**
         * Optional command prefix for prefix-based commands
         */
        prefix?: string;
    };

    /**
     * Skip TypeScript project and config checks
     */
    skipTypeScriptCheck?: boolean;

    /**
     * Whether the bot is public (global slash commands)
     */
    publicApp?: boolean;

    /**
     * Array of guild IDs to register guild-specific slash commands
     */
    guilds?: Snowflake[];

    /**
     * Optional paths for framework folders
     */
    folders?: {
        /**
         * Path to event handler files
         */
        events?: string;

        /**
         * Path to command handler files
         */
        commands?: string;

        /**
         * Path to component handler files (buttons, selects, etc.)
         */
        components?: string;
    };
}

export interface HarmonixPlugin {
    /**
     * Unique name of the plugin.
     * This will be used to access the plugin on the bot (e.g., bot._pluginName)
     */
    name: string;

    /**
     * Initialization method called when the plugin is registered.
     * Receives the Harmonix bot instance.
     * Can perform async operations (e.g., connect to a database)
     */
    init(bot: Harmonix): Promise<void> | void;
}

/**
 * Main bot class for Harmonix framework.
 * Extends Discord.js Client and adds support for:
 * - Commands (prefix, slash, both)
 * - Events with decorators
 * - Components (buttons, selects)
 * - Plugins system
 * 
 * Example usage:
 * ```ts
 * import { Harmonix, BotConfig } from "harmonix";
 * 
 * const botConfig: BotConfig = {
 *   bot: {
 *     id: "YOUR_BOT_CLIENT_ID",
 *     token: "YOUR_BOT_TOKEN"
 *   },
 *   publicApp: true,
 *   folders: {
 *     commands: "./src/commands",
 *     events: "./src/events",
 *     components: "./src/components"
 *   }
 * };
 * 
 * const bot = new Harmonix(botConfig);
 * 
 * // Register a plugin
 * bot.registerPlugin(...);
 * 
 * // Start listening
 * bot.login(botConfig.bot.token);
 * ```
 */
export class Harmonix extends Client {

    public readonly config: BotConfig;
    public logger: Logger = new Logger();
    private plugins: Map<string, HarmonixPlugin> = new Map();
    public commands: Map<'slash' | 'prefix', Collection<string, any>> = new Map([
        ['slash', new Collection()],
        ['prefix', new Collection()],
    ]);
    public components: Collection<String, any> = new Collection();
    public cooldowns: Collection<String, Collection<String, number>> = new Collection();
    private collections: Map<String, Collection<String, any>> = new Map();

    constructor(config: BotConfig) {
        super(config);

        if (!config.skipTypeScriptCheck && process.env.NODE_ENV !== 'test') {
            ensureTypeScriptProject();
            validateTypeScriptConfig();
        }

        this.config = config;
    }

    /**
     * Start the bot
     */
    async start() {
        this.startHandler();
        this.login(this.config.bot.token);
    }

    /**
     * Add a collection stored in the bot
     */
    addCollection<T>(name: string, collection: Collection<string, T>) {
        return this.collections.set(name, collection);
    }
    /**
     * Get a collection stored in the bot
     */
    getCollection<T>(name: string): Collection<string, T> | undefined {
        return this.collections.get(name) as Collection<string, T> | undefined;
    }

    /**
     * Use a plugin in the bot
     * Note: Plugin name will be prefixed with "_" to avoid name conflicts
     */
    use(plugin: HarmonixPlugin): this {
        const pluginName = "_" + plugin.name;
        if (this.plugins.has(pluginName)) {
            throw new Error(`Plugin with name '${pluginName}' is already registered.`);
        }

        this.plugins.set(pluginName, plugin);

        (this as any)[pluginName] = plugin;

        plugin.init(this);

        console.log(`Plugin with name '${pluginName}' registered.`);
        return this
    }

    /**
     * Get a registered plugin by name (without the "_" prefix)
     */
    getPlugin<T extends HarmonixPlugin>(name: string): T | undefined {
        return this.plugins.get("_" + name) as T | undefined;
    }

    private startHandler() {
        if (this.config.folders?.events) RegisterEvents(this, this.config.folders.events);
        if (this.config.folders?.commands) RegisterCommands(this, this.config.folders.commands);
        if (this.config.folders?.components) RegisterComponent(this, this.config.folders.components);
    }
}