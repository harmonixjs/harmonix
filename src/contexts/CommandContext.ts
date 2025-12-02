import { CacheType, ChatInputCommandInteraction, CommandInteractionOption, GuildMember, InteractionReplyOptions, InteractionResponse, Message, MessageCreateOptions, MessagePayload, MessageReplyOptions, Role, User } from "discord.js";
import ExtendsChannel from "../structures/ExtendsChannel";

export type CommandType = ChatInputCommandInteraction | Message;

export class CommandContext<T extends CommandType> extends ExtendsChannel {
  private type: T;
  private options?: Options;

  constructor(commandEvent: T, options?: Options) {
    super(commandEvent.guild);
    this.type = commandEvent;
    this.options = options;
  }

  get event(): T { return this.type; }
  get currentChannel() { return this.type.channel };
  get user() { return this.type.member.user; }

  // Methods General

  /**
   * Get the GuildMember of the user who triggered the command
   */
  async getMember() {
    return await this.guild?.members.fetch(this.user.id);
  }

  /**
   * Reply to the command interaction or message
   */
  reply(
    options: T extends Message
      ? string | MessagePayload | MessageReplyOptions
      : string | MessagePayload | InteractionReplyOptions
  ): Promise<T extends Message ? Message : InteractionResponse> {
    if (this.event instanceof Message) {
      // @ts-expect-error
      return this.event.reply(options);
    } else {
      // @ts-expect-error
      return this.event.reply(options);
    }
  }

  // Methods Specific to Slash Commands

  /**
   * Get the subcommand or subcommand group used
   * Only for slash commands
   * @returns readonly CommandInteractionOption<CacheType>[]
   */
  get getSubCommand() {
    if (this.event instanceof ChatInputCommandInteraction)
      return this.event.options.data;
  }

  /**
   * Get a specific option by its name
   * Only for slash commands
   */
  getOption<Y extends string | number | boolean = string | number | boolean>(name: string): CommandInteractionOptionEdited<Y> | undefined {
    if(this.event instanceof ChatInputCommandInteraction) {
      const base = this.event.options.get(name);
      if (!base) return undefined;
      return new CommandInteractionOptionEdited<Y>(base, base.value as Y);
    }
  }

  // Methods Specific to Prefix Commands

  /**
   * Get the arguments passed to the command
   * Only for prefix commands
   */
  getArgs(): string[] {
    if (this.event instanceof Message) {
      let len = this.options.prefix.length + this.options.cmdName.length;
      return this.event.content.slice(len).trim().split(/ +/g);
    } else {
      return [];
    }
  }

  /**
   * Get a specific argument by its index
   * Only for prefix commands
   */
  getArg(index: number): string {
    return this.getArgs()[index];
  }

  /**
   * Send a message to the current channel
   */
  send(options: string | MessagePayload | MessageCreateOptions): Promise<Message> {
    if (this.currentChannel.isSendable())
      return this.currentChannel.send(options);
    throw new Error("Channel not sendable");
  }
}

interface Options {
  prefix: string;
  cmdName: string;
  others: any;
}

class CommandInteractionOptionEdited<Y extends string | number | boolean = string | number | boolean>
    implements CommandInteractionOption<CacheType> {

    // On conserve toutes les propriétés originales
    name: string;
    type: number;
    focused: boolean;
    user?: User;
    member?: GuildMember|any;
    channel?: any;
    role?: Role|any;
    value?: Y; // On overwrite seulement value

    constructor(base: CommandInteractionOption<CacheType>, value?: Y) {
        // Copier toutes les propriétés de la base
        this.name = base.name;
        this.type = base.type;
        this.focused = base.focused;
        this.user = base.user;
        this.member = base.member;
        this.channel = base.channel;
        this.role = base.role;

        // Ici on overwrite value kawaii
        this.value = value ?? base.value as Y;
    }

    // Getter pratique si tu veux accéder au value original
    get baseValue() {
        return this.value;
    }
}