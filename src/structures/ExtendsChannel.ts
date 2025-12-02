import {
    Guild, Snowflake,
    GuildBasedChannel,
    NewsChannel, StageChannel, TextChannel, PrivateThreadChannel, PublicThreadChannel, VoiceChannel,
    VoiceBasedChannel,
} from "discord.js";

/**
 * ExtendsChannel is a helper class to simplify interaction with a Guild's channels.
 * Provides methods to easily fetch text or voice channels with proper typing.
 *
 * Example usage:
 * ```ts
 * import ExtendsChannel from "./ExtendsChannel";
 * 
 * const guild = client.guilds.cache.get("GUILD_ID");
 * if (!guild) return;
 * 
 * const channelHelper = new ExtendsChannel(guild);
 * 
 * // Get any channel by ID
 * const channel = channelHelper.getChannel("CHANNEL_ID");
 * 
 * // Get only text-based channels
 * const textChannel = channelHelper.getTextChannel("TEXT_CHANNEL_ID");
 * 
 * // Get only voice-based channels
 * const voiceChannel = channelHelper.getVoiceChannel("VOICE_CHANNEL_ID");
 * ```
 */
export default class ExtendsChannel {
    /**
     * The guild instance that this helper is bound to
     */
    public guild: Guild;

    /**
     * Create a new channel helper for a guild
     */
    constructor(guild: Guild) {
        this.guild = guild;
    }

    /**
     * Get any channel in the guild by its ID
     * @param channelId The ID of the channel (string or Snowflake)
     * @returns The channel if found, otherwise null
     */
    getChannel(channelId: string | Snowflake): GuildBasedChannel | null {
        return this.guild.channels.cache.get(channelId) || null;
    }

    /**
     * Get a text-based channel in the guild by its ID
     * @param channelId The ID of the channel (string or Snowflake)
     * @returns The text-based channel if found, otherwise null
     */
    getTextChannel(
        channelId: string | Snowflake
    ): NewsChannel | StageChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel | VoiceChannel | null {
        const chx = this.getChannel(channelId);
        return chx?.isTextBased() ? chx : null;
    }

    /**
     * Get a voice-based channel in the guild by its ID
     * @param channelId The ID of the channel (string or Snowflake)
     * @returns The voice-based channel if found, otherwise null
     */
    getVoiceChannel(channelId: string | Snowflake): VoiceBasedChannel | null {
        const chx = this.getChannel(channelId);
        return chx?.isVoiceBased() ? chx : null;
    }
}