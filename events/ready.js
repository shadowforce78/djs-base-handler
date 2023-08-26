const client = require("../index");

client.on("ready", () =>
    console.log(`${client.user.tag} is up and ready to go!`)
);

client.on('ready', () => {
    let number = 0;
    setInterval(() => {
        number = number + 1;
        client.user.setActivity(`Counting to infinity : ${number}`, { type: "WATCHING" })
    }, 2500)
})
