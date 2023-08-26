const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
const accountSchema = require("../../models/account");
module.exports = {
  name: "remove-account",
  description: "Delete your account from the bank",
  userperm: [""],
  botperm: [""],
  options: [
    {
      name: "code",
      description: "Your 4 digit code is required to delete your account",
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
    const errorEmbed = new MessageEmbed()
      .setTitle("Error")
      .setDescription("The code must be 4 digits long")
      .setColor("RED")
      .setTimestamp();
    const successEmbed = new MessageEmbed()
      .setTitle("Success")
      .setDescription(`You have been deleted from ${interaction.guild.name}`)
      .setColor("GREEN")
      .setTimestamp();
    const notRegistered = new MessageEmbed()
      .setTitle("Error")
      .setDescription("You are not registered")
      .setColor("RED")
      .setTimestamp();
    const wrongCode = new MessageEmbed()
      .setTitle("Error")
      .setDescription("The code is incorrect")
      .setColor("RED")
      .setTimestamp();

    const cancel = new MessageEmbed()
      .setTitle("Error")
      .setDescription("You have cancelled the deletion of your account")
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
    if (!isRegister)
      return interaction.followUp({
        embeds: [notRegistered],
      });
    if (isRegister.code !== code)
      return interaction.followUp({
        embeds: [wrongCode],
      });

    // Confirm the deletion of the account
    const confirmButton = new MessageButton()
      .setCustomId("confirm")
      .setLabel("Confirm")
      .setStyle("SUCCESS");
    const cancelButton = new MessageButton()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle("DANGER");
    const row = new MessageActionRow().addComponents([
      confirmButton,
      cancelButton,
    ]);
    const confirmEmbed = new MessageEmbed()
      .setTitle("Confirm")
      .setDescription(
        "Are you sure you want to delete your account with a balance of " +
          isRegister.balance +
          "?"
      )
      .setColor("BLUE")
      .setTimestamp();

    const msg = await interaction.followUp({
      embeds: [confirmEmbed],
      components: [row],
    });
    const filter = (btn) => btn.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 15000,
    });
    collector.on("collect", async (btn) => {
      if (btn.customId === "confirm") {
        await btn.update({
          embeds: [successEmbed],
          components: [],
        });
        await accountSchema.findOneAndDelete({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });

        // Delete the interaction after 2 seconds
        setTimeout(() => {
          interaction.deleteReply();
        }, 2000);
      } else if (btn.customId === "cancel") {
        await btn.update({
          embeds: [cancel],
          components: [],
        });

        // Delete the interaction after 2 seconds
        setTimeout(() => {
          interaction.deleteReply();
        }, 2000);
      }
    });

    setInterval(() => {
      if (msg.deleted) collector.stop();
    }, 1000);
  },
};
