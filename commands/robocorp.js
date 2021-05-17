const axios = require("axios");
const Discord = require("discord.js");
const workspacesId = "b5b4062d-5cc9-4313-8a78-1e6e4ed8367c";
const processId = "2d8dfa0f-74fe-45ce-b420-157d2b30f27f";

module.exports = {
  name: "rc",
  async execute(client, message, args, set) {
    message.delete().catch(_ => {});
    try {
      const startRun = await axios.request({
        url: `https://api.eu1.robocloud.eu/process-v1/workspaces/${workspacesId}/processes/${processId}/run-request`,
        method: "post",
        headers: {
          Authorization:
            "RC-WSKEY 3DBmSWWc1JPkJHNZATwTvaSqJo8wVJBLRIo8I6aU3JrUZMDghaSD0urpqN4hJZXLLkl3mFAiyU9DYWXYx3ykeK6SVoFkG"
        },
        data: '{ "type": "default" }'
      });
      console.log("Process started");
      console.log("ProcessRunId: " + startRun.data.id);
      await new Promise(resolve => setTimeout(resolve, 20000));

      //------------------------------------------------------------------------------------------------

      const LastRobotRunId = await axios.request({
        url: `https://api.eu1.robocloud.eu/process-v1/workspaces/${workspacesId}/processes/${processId}/runs/${startRun.data.id}`,
        method: "get",
        headers: {
          Authorization:
            "RC-WSKEY 3DBmSWWc1JPkJHNZATwTvaSqJo8wVJBLRIo8I6aU3JrUZMDghaSD0urpqN4hJZXLLkl3mFAiyU9DYWXYx3ykeK6SVoFkG"
        }
      });

      console.log("Robot Run ID: " + LastRobotRunId.data.robotRuns[0].id);
      console.log(LastRobotRunId.data);

      //------------------------------------------------------------------------------------------------

      const Artifacts = await axios.request({
        url: `https://api.eu1.robocloud.eu/process-v1/workspaces/${workspacesId}/processes/${processId}/runs/${startRun.data.id}/robotRuns/${LastRobotRunId.data.robotRuns[0].id}/artifacts`,
        method: "get",
        headers: {
          Authorization:
            "RC-WSKEY 3DBmSWWc1JPkJHNZATwTvaSqJo8wVJBLRIo8I6aU3JrUZMDghaSD0urpqN4hJZXLLkl3mFAiyU9DYWXYx3ykeK6SVoFkG"
        }
      });

      console.log(Artifacts.data);

      //------------------------------------------------------------------------------------------------



      const hourlyPrice = await axios.request({
        url: "https://fortum.heydaypro.com/tarkka/scripts/price_updater.php",
        method: "get"
      });

      const finalEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")

        
        .setAuthor(
          "Fortum",
          "https://cdn.glitch.com/b36f6025-fc9b-4c74-8ea6-63451e0a6fba%2Ffortum.png?v=1613033876752"
        )
        .setDescription("Current price: " + hourlyPrice.data.price + "c/kWh")
       
        .setTimestamp();

      client.users.cache.get("338649491894829057").send(finalEmbed);
    } catch (e) {
      console.log(e);
    }
  }
};
