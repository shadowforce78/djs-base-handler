const mongoose = require("mongoose");

module.exports = mongoose.model(
  "accountSchema",
  new mongoose.Schema({
    userId: String,
    guildId: String,
    code: Number,
    bankBalance: Number,
    handBalance: Number,
    createdAt: { type: Date, default: Date.now() },
    workCooldown: { type: Date, default: null },
    dailyCooldown: { type: Date, default: null },
    weeklyCooldown: { type: Date, default: null },
    robCooldown: { type: Date, default: null },
  })
);
