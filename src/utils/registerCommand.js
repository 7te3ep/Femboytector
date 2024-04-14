const getLocalCommands = require("./getLocalCommands");
const { REST, Routes } = require("discord.js");

module.exports = async (client) => {
   const Guilds = client.guilds.cache.map((guild) => guild.id);
   console.log(Guilds);
   try {
      const rest = new REST().setToken(client.config.token);

      const localCommands = getLocalCommands();
      let commands = [];
      for (const localCommand of localCommands) {
         const { name, description, options } = localCommand;
         commands.push({ name, description, options });
      }
      console.log(commands);
      const data = await rest.put(
         Routes.applicationGuildCommands(
            client.config.clientId,

            client.config.guildId
         ),
         { body: commands }
      );
   } catch (error) {}
};
