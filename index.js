const express = require("express");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen();

const BotTokens = [process.env.BOT_MO];
const set = require("./settings.json");

const functions = require("./functions.js");
const Discord = require("discord.js");
const schedule = require("node-schedule");
const axios = require("axios");

process.on("error", error => console.log(error));
process.on("uncaughtException", error => console.log(error));
process.on("unhandledRejection", error => console.log(error));

// FOR EACH =========================================================================================================
BotTokens.forEach(runBot);

function runBot(token) {
  const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    clientOptions: {
      fetchAllMembers: true
    }
  });

  client.on("error", error => functions.Error(client, error));

  client.on("messageReactionAdd", async (reaction, user) => {
    if (set[client.user.username].rrRolesFunction == true) {
      functions.RoleAdd(
        client,
        reaction,
        user,
        set[client.user.username].rrMessageId
      );
    } else if (set[client.user.username].rrScheduler == true) {
      await functions.Scheduler(client, reaction, user);
    }
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    if (set[client.user.username].rrRolesFunction == true) {
      functions.RoleRemove(
        client,
        reaction,
        user,
        set[client.user.username].rrMessageId
      );
    } else if (set[client.user.username].rrScheduler == true) {
      await functions.Scheduler(client, reaction, user);
    }
  });

  client.on("ready", async () => {
    functions.Fortum(client);
    console.log("Status set for the first time");
    setInterval(() => {
      functions.Fortum(client);
      console.log("Status interval executed");
    }, 60000);
  });

  client.login(token);
  // END =========================================================================================================
  client.on("message", async message => {
    if (client.user.id != message.author.id) {
      // COMMANDS =========================================================================================================
      if (message.content.startsWith(set[client.user.username].prefix)) {
        functions.Command(
          client,
          Discord,
          message,
          set[client.user.username].prefix,
          functions,
          set
        );
      } else {
        // Dialogflow =========================================================================================================
        if (
          (client.user.id != message.author.id &&
            !message.content.startsWith(set[client.user.username].prefix) &&
            message.channel.type == "dm") ||
          (message.cleanContent.startsWith("@" + client.user.username + " ") ||
            message.cleanContent.startsWith(client.user.username + " ") ||
            message.cleanContent.startsWith(
              client.user.username.toLowerCase() + " "
            ))
        ) {
          functions.DialogflowIntents(client, message, set);
        }
      }
    }
  });
}
