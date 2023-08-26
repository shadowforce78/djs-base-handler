const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const accountSchema = require("../../models/account");
const ms = require("ms");

module.exports = {
  name: "daily",
  description: "Get your daily reward",
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
    if (accountCooldown.dailyCooldown !== null) {
      const cooldownMS = 86400000
      const timeLeft = Date.now() - accountCooldown.dailyCooldown;
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
        dailyCooldown: Date.now(),
      }
    );

    // Daily amout is between 1000 and 2000
    const dailyAmount = Math.floor(Math.random() * 1000) + 1000;
    const dailyEmbed = new MessageEmbed()
      .setTitle("Daily")
      .setDescription(`You have been given $${dailyAmount}`)
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
        bankBalance: accountCooldown.bankBalance + dailyAmount,
      }
    );

    interaction.followUp({
      embeds: [dailyEmbed],
    });
  },
};
