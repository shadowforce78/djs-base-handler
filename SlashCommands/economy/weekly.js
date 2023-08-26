const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const accountSchema = require("../../models/account");
const ms = require("ms");

module.exports = {
  name: "weekly",
  description: "Get your weekly reward",
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
    if (accountCooldown.weeklyCooldown !== null) {
      const cooldownMS = 604800016.56
      const timeLeft = Date.now() - accountCooldown.weeklyCooldown;
      if (timeLeft < cooldownMS) {
        const timeLeftEmbed = new MessageEmbed()
          .setTitle("Error")
          .setDescription(
            `You are under cooldown for another ${ms(cooldownMS - timeLeft, {
              long: true,
            })}`
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
        weeklyCooldown: Date.now(),
      }
    );

    // weekly amout is between 10000 and 15000
    const weeklyAmount = Math.floor(Math.random() * 5000) + 10000;
    const weeklyEmbed = new MessageEmbed()
      .setTitle("weekly")
      .setDescription(`You have been given $${weeklyAmount}`)
      .setColor("GREEN")
      .setTimestamp();

    await accountSchema.findOneAndUpdate(
      {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      },
      {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
        bankBalance: accountCooldown.bankBalance + weeklyAmount,
      }
    );

    interaction.followUp({
      embeds: [weeklyEmbed],
    });
  },
};
