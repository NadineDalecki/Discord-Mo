
const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "e",
  async execute(client, message, args, set) {
  
    if (client.user.username === "Mo") {
      const hourlyPrice = await axios.request({
        url: "https://fortum.heydaypro.com/tarkka/scripts/price_updater.php",
        method: "get"
      });
console.log("setting price manually")
    client.user.setActivity(`Fortum: ${hourlyPrice.data.price} c/kWh`, { type: 'WATCHING' })

    }
  }
};
