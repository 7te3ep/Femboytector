const {
   ApplicationCommandOptionType,
   PermissionFlagsBits,
   AttachmentBuilder,
   ButtonStyle,
   ModalBuilder,
   TextInputBuilder,
   TextInputStyle,
   ComponentType,
   StringSelectMenuBuilder,
   StringSelectMenuOptionBuilder,
} = require("discord.js");
const {
   ButtonBuilder,
   SlashCommandBuilder,
   EmbedBuilder,
   ActionRowBuilder,
} = require("@discordjs/builders");

module.exports = async (
   interaction,
   emoji,
   error,
   emphemeral = true,
   editReply = false
) => {
   const file = new AttachmentBuilder(`src/assets/cards.png`);
   const embed = new EmbedBuilder()
      .setAuthor({ name: "Taoqartes", iconURL: "attachment://cards.png" })
      .setTitle("❌ Action impossible")
      .setDescription("### ```" + emoji + " " + error + "```");

   if (!editReply) {
      return interaction.reply({
         embeds: [embed],
         ephemeral: emphemeral,
         files: [file],
      });
   }
   return interaction.editReply({
      embeds: [embed],
      ephemeral: emphemeral,
      files: [file],
   });
};
