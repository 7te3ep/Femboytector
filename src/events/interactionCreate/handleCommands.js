const { dev, testServer, superAdmins } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const { AttachmentBuilder } = require("discord.js");
const db = require("../../backend/db");

module.exports = async (client, interaction) => {
   if (!interaction.isChatInputCommand() && !interaction.isAutocomplete())
      return;

   console.log(`=> try : ${interaction.commandName} by ${interaction.user.id}`);
   const localCommands = getLocalCommands();

   try {
      const commandObject = localCommands.find(
         (cmd) => cmd.name === interaction.commandName
      );

      if (!commandObject) return;

      if (interaction.isAutocomplete()) {
         await commandObject.autocomplete(client, interaction, db);
      } else {
         await commandObject.callback(client, interaction, db);
      }
   } catch (error) {
      console.log("Error while running command :", error);
   }
};
