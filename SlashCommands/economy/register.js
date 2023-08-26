const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const accountSchema = require("../../models/account");

module.exports = {
  name: "register",
  description: "Register your account to the bank",
  userperm: [""],
  botperm: [""],
  options: [
    {
      name: "code",
      description: "Chose a 4 digit code to secure your account",
      type: "NUMBER",
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const code = interaction.options.getNumber("code");
    const balance = 2000;
    const errorEmbed = new MessageEmbed()
      .setTitle("Error")
      .setDescription("The code must be 4 digits long")
      .setColor("RED")
      .setTimestamp();
    const successEmbed = new MessageEmbed()
      .setTitle("Success")
      .setDescription(
        `You have been registered on ${interaction.guild.name} with the code \`${code}\` and an bank balance of $${balance} and a hand balance of $0`
      )
      .setColor("GREEN")
      .setTimestamp();

    const alreadyRegistered = new MessageEmbed()
      .setTitle("Error")
      .setDescription("You are already registered")
      .setColor("RED")
      .setTimestamp();

    if (code.toString().length !== 4)
      return interaction.followUp({
        embeds: [errorEmbed],
      });

    // Check if the user is already registered in the server database
    const isRegister = await accountSchema.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });
    if (isRegister)
      return interaction.followUp({
        embeds: [alreadyRegistered],
      });
    // Send dm to the user but first, check if the user has dms disabled
    try {
      await interaction.user.send({
        embeds: [successEmbed],
      });
    } catch (error) {
      return interaction.followUp({
        content: "You have dms disabled, please enable it and try again",
      });
    }

    await accountSchema.findOneAndUpdate(
      {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      },
      {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
        code: code,
        bankBalance: balance,
        handBalance: 0,
        workCooldown: 0,
        dailyCooldown: 0,
        weeklyCooldown: 0,
        robCooldown: 0,
      },
      {
        upsert: true,
      }
    );

    // Send interaction followup
    interaction.followUp({
      content: "Check your dm to see your account details",
    });

    // Delete the interaction after 2 seconds
    setTimeout(() => {
      interaction.deleteReply();
    }, 2000);
  },
};
