const db = require("./db");
const config = require("../../config.json");
const {
   ComponentType,
   AttachmentBuilder,
   ActionRowBuilder,
   ButtonBuilder,
   ButtonStyle,
} = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");

const registerSnapshot = async () => {
   await db.registerSnapshot();
};

const sendDailyReminder = async (client) => {
   const schedulUsers = Object.keys((await db.getSub()) || {});
   const file = new AttachmentBuilder(`src/assets/cards.png`);
   const embed = new EmbedBuilder()
      .setTitle("⏰ N'oubliez pas de /daily !")
      .setAuthor({ name: "Taoqartes", iconURL: "attachment://cards.png" });

   const dayOfYear = (date) =>
      Math.floor(
         (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
      );

   for (const user of schedulUsers) {
      const userInstance = await client.users.fetch(user);
      const currentDay = dayOfYear(new Date());
      let lastDayDaily = await db.getUser(user, client);
      if (!lastDayDaily) lastDayDaily = await db.getUser(user, client);
      lastDayDaily = lastDayDaily.lastDaily;
      if (lastDayDaily > 400) lastDayDaily = currentDay - 1;
      if (lastDayDaily == currentDay || !userInstance) continue;

      userInstance
         .send({
            embeds: [embed],
            files: [file],
         })
         .catch((error) => {
            console.log("error");
         });
   }
};

const scanGiveaways = async (client) => {
   const giveaways = Object.entries((await db.getGiveaways()) || {});
   const curr = Date.now() + 100;
   giveaways.forEach(async (giveaway) => {
      console.log(giveaway);
      console.log(curr - giveaway[1].create, giveaway[1].time);
      if (curr - giveaway[1].create >= giveaway[1].time) {
         const channel = client.channels.cache.get(giveaway[1].channel);
         const users = Object.keys(giveaway[1].list || {});
         const winner = users[Math.floor(Math.random() * users.length)];
         const user = await db.getUser(winner, client);
         await channel.send({
            content: `## 🎉 <@${winner}> a gagné : ${giveaway[1].gain} coins !`,
         });
         await db.delGiveaway(giveaway[0]);
         await db.updateUser(winner, {
            coins: parseInt(user.coins) + parseInt(giveaway[1].gain),
         });
      }
   });
};

const sendPropal = async (client) => {
   const current = (await db.getMsgIndex()) || 0;
   const file = new AttachmentBuilder(`src/assets/cards.png`);
   const genEmbed = (txt) => {
      return new EmbedBuilder()
         .setTitle(`Hey !`)
         .setAuthor({ name: "Taoqartes", iconURL: "attachment://cards.png" })
         .setDescription(`**${txt}**`);
   };

   const taoEmbeds = [
      genEmbed(
         "[🤝 Une idée de carte ? Propose nous !](https://docs.google.com/forms/d/e/1FAIpQLSehKzOoaV4HxRRC6hMud0S-XbaMlWXVfIJyNNaRzVfwTeQ9Gg/viewform?usp=pp_url)"
      ),
      genEmbed(
         "[🃏 Une idée de carte ? Propose nous !](https://docs.google.com/forms/d/e/1FAIpQLSehKzOoaV4HxRRC6hMud0S-XbaMlWXVfIJyNNaRzVfwTeQ9Gg/viewform?usp=pp_url)"
      ),
   ];
   const chan = Object.values(await db.getGuilds());
   const channel = client.channels.cache.get(chan[0]);
   channel.send({ embeds: [taoEmbeds[current]], files: [file] });
   let newIndex = parseInt(current) + 1;
   if (newIndex == 2) newIndex = 0;
   await db.setMsgIndex(newIndex);
};

const spawnCoins = async (client) => {
   if (config.devStatus) return;
   Object.values((await db.getGuilds()) || {}).forEach(async (id) => {
      const channel = client.channels.cache.get(id);
      const luck = Math.random();
      if (luck < 0.05) {
         const min = await db.getParam("bagMin");
         const max = await db.getParam("bagMax");
         const qty = Math.floor(min + Math.random() * (max - min));

         const file = new AttachmentBuilder(`src/assets/cards.png`);
         const claimBtn = new ButtonBuilder()
            .setCustomId("test")
            .setLabel("Claim it")
            .setStyle(ButtonStyle.Success);

         const actionRow = new ActionRowBuilder().addComponents(claimBtn);

         const embed = new EmbedBuilder()
            .setDescription(
               "# 💰💨 POUF ! \n un sac de coins tombe du ciel !" +
                  "```It contains " +
                  qty +
                  " 🪙```"
            )
            .setAuthor({
               name: "Taoqartes",
               iconURL: "attachment://cards.png",
            });

         const repliedEmbed = await channel.send({
            embeds: [embed],
            files: [file],
            components: [actionRow],
         });

         const collector = await repliedEmbed.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 120_000,
         });

         collector.on("collect", async (i) => {
            i.deferUpdate();
            claimBtn.setDisabled(true);
            repliedEmbed.edit({ components: [actionRow] });
            const currentCoins = (await db.getUser(i.user.id, client)).coins;
            await db.updateUser(i.user.id, { coins: currentCoins + qty });
         });

         collector.on("end", (i) => {
            claimBtn.setDisabled(true);
            repliedEmbed.edit({ components: [actionRow] });
         });
      }
   });
};

module.exports = {
   spawnCoins,
   registerSnapshot,
   sendDailyReminder,
   sendPropal,
   scanGiveaways,
};
