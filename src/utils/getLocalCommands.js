const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (exeptions = []) => {
   let localCommands = [];

   const commandCategories = getAllFiles(
      path.join(__dirname, "..", "commands"),
      true
   );

   for (const commandCategory of commandCategories) {
      const commandFiles = getAllFiles(commandCategory);
      for (const commandFile of commandFiles) {
         const commandObj = require(commandFile);

         if (exeptions.includes(commandObj.name)) continue;

         localCommands.push(commandObj);
      }
   }
   return localCommands;
};
