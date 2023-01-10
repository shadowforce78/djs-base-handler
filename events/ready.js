const client = require("../index");

client.on("ready", () =>
    console.log(`${client.user.tag} is up and ready to go!`)
);

client.on('ready', () => {
    client.user.setActivity('Some activity', { type: 'PLAYING' });
})
