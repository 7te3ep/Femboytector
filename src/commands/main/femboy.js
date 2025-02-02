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
const { exec } = require("child_process");
const {
   ButtonBuilder,
   SlashCommandBuilder,
   EmbedBuilder,
   ActionRowBuilder,
} = require("@discordjs/builders");

const db = require("../../backend/db");

module.exports = {
   name: "femboy",
   description: "Find the femboy",

   callback: async (client, interaction) => {
      await interaction.deferReply();
      const willBeFem = Math.random() > 0.5;
      const possibilities = Object.keys(
         (await db.getData(willBeFem ? "femboy" : "GothGirls")) || {}
      );
      const choose =
         possibilities[Math.floor(Math.random() * possibilities.length)];
      const link = `https://i.redd.it/${
         choose.slice(0, 13) + "." + choose.slice(13)
      }`;
      const userId = interaction.user.id;
      const userPlayed = {};
      let participants = 0;
      let wins = 0;
      let loses = 0;
      const isFem = new ButtonBuilder()
         .setCustomId("isFem")
         .setLabel("Yes")
         .setStyle(ButtonStyle.Success);

      const notFem = new ButtonBuilder()
         .setCustomId("notFem")
         .setLabel("No")
         .setStyle(ButtonStyle.Danger);

      const actionRow = new ActionRowBuilder().addComponents([isFem, notFem]);

      let embed = new EmbedBuilder()
         .setTitle(`** Is it a femboy ? **`)
         .setImage(link)
         .setColor(0x000000)
         .setFooter({ text: "0 participants" });

      const repliedEmbed = await interaction.editReply({
         content: `Host by <@${userId}>`,
         embeds: [embed],
         components: [actionRow],
         files: [],
         ephemeral: false,
      });

      const collector = await repliedEmbed.createMessageComponentCollector({
         componentType: ComponentType.Button,
         time: 10_000,
      });

      collector.on("collect", async (i) => {
         if (userPlayed[i.user.id]) return i.deferUpdate();

         await i.deferReply({ ephemeral: true });
         const answer = i.customId == "isFem";
         if (answer == willBeFem) wins++;
         else loses++;
         participants++;

         userPlayed[i.user.id] = { won: answer == willBeFem };

         repliedEmbed.edit({
            embeds: [
               embed.setFooter({
                  text: `${participants} participants `,
               }),
            ],
         });

         return await i.editReply({
            content: answer
               ? "You think its a femboy"
               : "You think its a women",
            ephemeral: true,
         });
      });

      collector.on("end", async (collected) => {
         let str = "Players : \n";
         Object.entries(userPlayed || {}).forEach((el) => {
            str += ` - <@${el[0]}> : ${el[1].won ? "Gagné" : "Perdu"}`;
         });

         const embed = new EmbedBuilder()
            .setTitle(`**Game ended : It was a ${willBeFem ? "Femboy" : "Women" }**`)
	    .setDescription(str)
            .setColor(0x000000)
            .setFooter({ text: `${(wins / (wins + loses)) * 100}% winrate` });

         await interaction.followUp({
            embeds: [embed],
         });
         actionRow.components.forEach((btn) => btn.setDisabled(true));
         repliedEmbed.edit({ components: [actionRow] });
      });
   },
};
