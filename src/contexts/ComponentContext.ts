import {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    InteractionDeferReplyOptions,
    InteractionEditReplyOptions,
    InteractionReplyOptions,
    MentionableSelectMenuInteraction,
    MessageCreateOptions,
    MessagePayload,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    TextBasedChannel,
    TextChannel,
    UserSelectMenuInteraction
} from "discord.js";
import ExtendsChannel from "../structures/ExtendsChannel";

export type ComponentEvent =
    ButtonInteraction |
    StringSelectMenuInteraction |
    UserSelectMenuInteraction |
    RoleSelectMenuInteraction |
    MentionableSelectMenuInteraction |
    ChannelSelectMenuInteraction;

/**
 * Context wrapper for component interactions (buttons, selects) in Harmonix.
 * Extends ExtendsChannel to provide easy access to the guild's channels.
 */
export class ComponentContext<T extends ComponentEvent> extends ExtendsChannel {
    /**
     * The original interaction event
     */
    private interaction: T;

    /**
     * Wraps a Discord component interaction into a context for easier access
     * @param interaction The component interaction (ButtonInteraction, SelectMenuInteraction, etc.)
     */
    constructor(interaction: T) {
        super(interaction.guild);
        this.interaction = interaction;
    }

    // =====================
    // Getters
    // =====================

    /**
     * The raw interaction event
     */
    get event(): T { return this.interaction; }

    /**
     * The current text-based channel of the interaction
     * Throws if the channel is not available
     */
    get currentChannel(): TextBasedChannel {
        if (!this.interaction.channel) {
            throw new Error("Channel not found");
        }
        return this.interaction.channel as TextBasedChannel;
    }

    /**
     * The user who triggered the interaction
     */
    get user() { return this.interaction.user; }

    // =====================
    // Methods
    // =====================

    /**
     * Fetch the GuildMember for the user who triggered the interaction
     * @returns The GuildMember or null if guild is unavailable
     */
    async getMember() {
        if (!this.interaction.guild) return null;
        return await this.interaction.guild.members.fetch(this.interaction.user.id);
    }

    /**
     * Reply to the interaction
     * @param options Message content or options to reply with
     */
    reply(options: string | MessagePayload | InteractionReplyOptions) {
        return this.interaction.reply(options);
    }

    /**
     * Edit the reply of the interaction
     * @param options Message content or options to edit the reply
     */
    editReply(options: string | MessagePayload | InteractionEditReplyOptions) {
        return this.interaction.editReply(options);
    }

    /**
     * Sends a message both as a reply and optionally in a specific channel
     * @param options Object containing `reply` and `channel` messages
     */
    send(options: { reply: string | MessagePayload | InteractionReplyOptions, channel: string | MessagePayload | MessageCreateOptions; }) {
        this.reply(options.reply);
        if ("send" in this.currentChannel && typeof this.currentChannel.send === "function") {
            (this.currentChannel as TextChannel).send(options.channel);
        } else {
            console.warn("The current channel does not support sending messages.");
        }
    }

    /**
     * Defer the reply for the interaction
     * @param options Interaction defer options (must include `withResponse: true`)
     */
    async deferReply(options: InteractionDeferReplyOptions & { withResponse: true }) {
        return this.event.deferReply(options);
    }
}