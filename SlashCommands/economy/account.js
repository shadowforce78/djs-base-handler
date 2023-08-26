const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const accountSchema = require("../../models/account");

module.exports = {
  name: "account",
  description: "Check your account or someone else's",
  userperm: [""],
  botperm: [""],
  options: [
    {
      name: "user",
      description: "User to check the account of",
      type: "USER",
      required: false,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const user = interaction.options.getUser("user") || interaction.user;
    const isRegister = await accountSchema.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });
    if (!isRegister)
      return interaction.followUp({
        content:
          "This user is not registered in the bank of this server (/register)",
      });

    const userName = client.users.cache.get(isRegister.userId);
    //   Get created date from the db
    const createdDate = isRegister.createdAt;
    //   Format the date
    const date = createdDate.toLocaleDateString();
    const time = createdDate.toLocaleTimeString();
    const bankBalance = isRegister.bankBalance;
    const handBalance = isRegister.handBalance;
    const accountNumber = user.id.slice(0, 6);
    const totalBal = bankBalance + handBalance;
    const embed = new MessageEmbed()
      .setTitle(`${userName.username}'s account`)
      .setDescription(
        `**Account Holder**: ${userName.username}\n\n**Account Number**: ${accountNumber}\n\n**Bank Balance**: $${bankBalance}\n\n**Money in Hand**: $${handBalance}\n\n**Total Money**: $${totalBal}\n\n**Account Created**: ${date} ${time}`
      )
      .setColor("RANDOM")
      .setTimestamp();

    await interaction.followUp({ embeds: [embed] });
  },
};
