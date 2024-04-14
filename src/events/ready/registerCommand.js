const getLocalCommands = require("../../utils/getLocalCommands");
const { REST, Routes } = require("discord.js");
const client = require("../../index");
const rest = new REST().setToken(client.config.token);

module.exports = async (client) => {
   try {
      const localCommands = getLocalCommands();
      let commands = [];
      for (const localCommand of localCommands) {
         const { name, description, options } = localCommand;
         commands.push({ name, description, options });
      }
      //await rest
      //   .put(
      //      Routes.applicationGuildCommands(config.clientId, config.testServer),
      //      { body: [] }
      //   )
      //   .then(() => console.log("Successfully deleted all guild commands."))
      //   .catch(console.error);
      //await rest
      //   .put(Routes.applicationCommands(config.clientId), { body: [] })
      //   .then(() => console.log("Successfully deleted all global commands."))
      //   .catch(console.error);
      console.log(client.config.clientId);
      await rest
         .put(Routes.applicationCommands(client.config.clientId), {
            body: [],
         })
         .then(() => console.log("Successfully added all global commands."))
         .catch(console.error);
   } catch (error) {
      console.log(`There was an error: ${error}`);
   }
};
