# 🤖 Harmonix Framework

[![npm version](https://img.shields.io/npm/v/@harmonixjs/harmonix.svg)](https://www.npmjs.com/package/@harmonixjs/harmonix)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, type-safe Discord.js framework with decorators and advanced features.

⚠️ **TypeScript Only** - JavaScript is not supported.

## ✨ Features

- 🎯 **TypeScript-first** with full type safety
- 🎨 **Decorator-based** commands and events
- 💾 **Built-in database** support (optional)
- 🔌 **Plugin system** for extensibility
- 🚀 **Easy to use** but powerful
- 📦 **Zero config** to get started

## 📦 Installation

```bash
npm install @harmonixjs/harmonix
npm install --save-dev typescript
```

## 🚀 Quick Start

### 1. Initialize TypeScript

```bash
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES2022",
    "module": "commonjs",
    "strict": true
  }
}
```

### 2. Create your bot

```typescript
// src/index.ts
import { Harmonix, BotConfig } from "harmonix";

const botConfig: BotConfig = {
  bot: {
    id: "YOUR_BOT_CLIENT_ID",
    token: "YOUR_BOT_TOKEN"
  },
  publicApp: true,
  folders: {
    commands: "./src/commands",
    events: "./src/events",
    components: "./src/components"
  }
};

const bot = new Harmonix(botConfig);

// Register a plugin
bot.registerPlugin(...);

// Start listening
bot.login(botConfig.bot.token);
```

### 3. Create a command / event / component

```typescript
// src/commands/Ping.ts
@Command({
    name: "ping",
    description: "Ping command",
})
export default class PingCommand implements CommandExecutor<ChatInputCommandInteraction> {
    execute(bot: Harmonix, ctx: CommandContext<ChatInputCommandInteraction<CacheType>>) {
        ctx.reply("Pong!");
    }
}
```

```typescript
// src/events/Ready.ts
@Event(Events.ClientReady)
export default class ClientReady implements EventExecutor<Events.ClientReady> {
    execute(bot: Harmonix, client: Client<true>) {
        bot.logger.sendLog("SUCCESS", `Bot is ready! Logged in as ${client.user.tag}`);
    }
}
```

```typescript
// src/components/TestButton.ts
@Component({
    id: "test_button"
})
export default class TestButton implements ComponentExecutor<ButtonInteraction> {
    execute(bot: Harmonix, ctx: ComponentContext<ButtonInteraction<CacheType>>) {
        ctx.reply("Test button clicked!");
    }
}
```

### 4. Run your bot

```bash
npx tsc
node dist/index.js
```

## 📚 Documentation

Visit our [documentation](https://github.com/harmonixjs/harmonix/wiki) for detailed guides and API reference.

## 🔌 Plugins (In Development..)

Harmonix supports first-class plugins — you can add plugins directly to the framework to register commands, events, middleware, or extend internals.

