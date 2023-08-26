const {
  Client,
  CommandInteraction,
  MessageButton,
  MessageEmbed,
  MessageActionRow,
} = require("discord.js");
const accountSchema = require("../../models/account");
const ms = require("ms");

module.exports = {
  name: "work",
  description: "Work for money",
  userperm: [""],
  botperm: [""],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    // Check if the user is under cooldown in the server database
    const accountCooldown = await accountSchema.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });
    if (!accountCooldown)
      return interaction.followUp({
        content:
          "You are not registered in the bank of this server (/register)",
      });
    // If the user is under cooldown, then send a message 
    if (accountCooldown.workCooldown !== null) {
      const cooldownMS = 600000
      const timeLeft = Date.now() - accountCooldown.workCooldown;
      if (timeLeft < cooldownMS) {
        const timeLeftEmbed = new MessageEmbed()
          .setTitle("Error")
          .setDescription(
            `You are under cooldown for another ${ms(
              cooldownMS - timeLeft,
              { long: true }
            )}`
          )
          .setColor("RED")
          .setTimestamp();
        return interaction.followUp({
          embeds: [timeLeftEmbed],
        });
      }
    }

    // If the user is not under cooldown, then continue
    await accountSchema.findOneAndUpdate(
      {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      },
      {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
        workCooldown: Date.now(),
      }
    );

    const list_of_jobs = [
      "McDonalds",
      "Walmart",
      "Target",
      "Costco",
      "Starbucks",
      "Taco Bell",
      "KFC",
      "Burger King",
      "Wendys",
      "Chick-fil-A",
      "Subway",
      "Dominos",
      "Pizza Hut",
      "Chipotle",
      "Panda Express",
      "Dunkin Donuts",
      "Panera Bread",
      "Olive Garden",
      "Red Lobster",
      "Dairy Queen",
      "O'Tacos",
      "Five Guys",
      "In-N-Out",
      "Carl's Jr.",
      "Fresh Burritos",
      "Baskin Robbins",
      "Denny's",
      "Popeyes",
      "Sonic",
      "Jack in the Box",
      "Little Caesars",
      "Papa John's",
      "Arby's",
      "Jimmy John's",
      "Whataburger",
      "White Castle",
      "Old Wild West",
      "Vapiano",
      "Big Fernand",
      "Coq En Pate",
      "Paradis du Fruit",
      "56°C",
      "Quick",
      "Pokawa",
      "Veng Hour",
      "Sushi Lin",
      "Edo Sushi",
      "Jeff de Bruges",
    ];
    const random = Math.floor(Math.random() * list_of_jobs.length);
    const jobs = list_of_jobs[random];
    const amount = Math.floor(Math.random() * 500) + 1;
    const button = new MessageButton()
      .setCustomId("work")
      .setLabel("Work")
      .setStyle("PRIMARY");
    const button2 = new MessageButton()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle("DANGER");
    const row = new MessageActionRow().addComponents([button, button2]);
    const filter = (button) => button.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    const workEmbed = new MessageEmbed()
      .setTitle("Work")
      .setDescription(`Do you want to work as a cashier at ${jobs}?`)
      .setColor("RANDOM")
      .setFooter({
        text: "You can earn a minimum of $1 and a maximum of $500",
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    await interaction.followUp({
      embeds: [workEmbed],
      components: [row],
    });
    collector.on("collect", async (button) => {
      if (button.customId === "work") {
        const isRegister = await accountSchema.findOne({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });
        if (!isRegister) {
          await interaction.followUp({
            content:
              "You are not registered in the bank of this server (/register)",
          });
        } else {
          await accountSchema.findOneAndUpdate(
            {
              userId: interaction.user.id,
              guildId: interaction.guild.id,
            },
            {
              userId: interaction.user.id,
              guildId: interaction.guild.id,
              $inc: {
                bankBalance: amount,
              },
            }
          );
          await interaction.followUp({
            content: `You worked as a cashier at ${jobs} and earned $${amount}`,
          });
          collector.stop();
          interaction.deleteReply();
        }
      } else if (button.customId === "cancel") {
        await interaction.followUp({
          content: `You have cancelled working as a cashier at ${jobs}`,
        });
        collector.stop();
        interaction.deleteReply();
      }
    });
    collector.on("end", async (button) => {
      if (button.size === 0) {
        await interaction.followUp({
          content: `You did not choose anything`,
        });
      }
    });
  },
};
