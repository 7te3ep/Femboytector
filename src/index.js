const { Client, GatewayIntentBits, Partials } = require("discord.js");
const {
   registerSnapshot,
   sendDailyReminder,
   sendPropal,
   spawnCoins,
   scanGiveaways,
} = require("./backend/scheduleEvent");
const { Guilds, MessageContent, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const registerCommands = require("./utils/registerCommand");
const eventHandler = require("./handlers/eventHandler");
const schedule = require("node-schedule");
const db = require("./backend/db");
const client = new Client({
   intents: [Guilds, GuildMessages, MessageContent],
   partials: [User, Message, GuildMember, ThreadMember],
});

client.config = require("../config.json");

client.on("ready", async () => {
   client.user.setActivity(client.config.version);
   await eventHandler(client);
   await registerCommands(client);
});

client.login(client.config.token);
