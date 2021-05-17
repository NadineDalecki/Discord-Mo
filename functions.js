const Discord = require("discord.js");
const dialogflow = require("@google-cloud/dialogflow");
const fs = require("fs");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { google } = require("googleapis");
const set = require("./settings.json");
const axios = require("axios");

module.exports = {
  DialogflowIntents: function(client, message, set) {
    client.dialogues = new Discord.Collection();
    const dialogflowFiles = fs
      .readdirSync("./dialogflow")
      .filter(file => file.endsWith(".js"));
    for (const file of dialogflowFiles) {
      const dialog = require(`./dialogflow/${file}`);
      client.dialogues.set(dialog.name, dialog);
    }

    if (!client.dialogues.has(client.user.username)) return;
    try {
      client.dialogues.get(client.user.username).execute(client, message, set);
    } catch (error) {
      console.error(error);
    }
  },
  Command: function(client, Discord, message, Prefix, functions, set) {
    client.commands = new Discord.Collection();
    const commandFiles = fs
      .readdirSync("./commands")
      .filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    }
    const args = message.content.slice(Prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;
    try {
      if (command !== "") {
        client.commands.get(command).execute(client, Discord, message, functions, args, set);
      }
    } catch (error) {
      console.error(error);
    }
  },
  DeletedMessage: async function(client, message) {
    const entry = await message.guild
      .fetchAuditLogs({ type: "MESSAGE_DELETE" })
      .then(audit => audit.entries.first());
    let user = "";
    try {
      if (
        entry.extra.channel.id === message.channel.id &&
        entry.target.id === message.author.id &&
        entry.createdTimestamp > Date.now() - 5000 &&
        entry.extra.count >= 1
      ) {
        user = entry.executor.username;
      } else {
        user = message.author.username;
      }

      const embed = new Discord.MessageEmbed()
        .setColor("#c20000")
        .setAuthor(
          `${user} deleted a message from ${message.author.username} in #${message.channel.name}`,
          user.displayAvatarURL
        )
        .setDescription(`${message.content}`);

      client.channels.cache
        .get(set[client.user.username].logChannel)
        .send(embed);
    } catch (error) {
      console.log(error);
    }
  },
  DialogflowQuery: async function(message, key, email, id) {
    const config = {
      credentials: {
        private_key: key,
        client_email: email
      }
    };
    const sessionClient = new dialogflow.SessionsClient(config);
    const sessionPath = sessionClient.projectAgentSessionPath(
      id,
      message.author.id.substring(0, 11)
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message.cleanContent,
          languageCode: "en-US"
        }
      }
    };
    const result = await sessionClient.detectIntent(request);
    const intent = result[0].queryResult.intent.displayName;
    const response = result[0].queryResult.fulfillmentText;
    return { result, intent, response };
  },
  EmbedBuilder: function(embed) {
    const newEmbed = new Discord.MessageEmbed();
    if (embed[0].Color !== "undefined") {
      newEmbed.setColor(embed[0].Color);
    }
    if (embed[0].Title !== "undefined") {
      newEmbed.setTitle(embed[0].Title);
    }
    if (embed[0].URL !== "undefined") {
      newEmbed.setURL(embed[0].URL);
    }
    if (embed[0].Author_Text !== "undefined") {
      newEmbed.setAuthor(
        embed[0].Author_Text,
        embed[0].Author_Avatear_Link,
        embed[0].Author_URL
      );
    }
    if (embed[0].Description !== "undefined") {
      newEmbed.setDescription(embed[0].Description);
    }
    if (embed[0].Thumbnail !== "undefined") {
      newEmbed.setThumbnail(embed[0].Thumbnail);
    }
    if (embed[0].Image !== "undefined") {
      newEmbed.setImage(embed[0].Image);
    }
    if (embed[0].Image !== "undefined") {
      newEmbed.setImage(embed[0].Image);
    }
    if (embed[0].Footer_Avatar_URL !== "undefined" && embed[0].Footer_Text) {
      newEmbed.setFooter(embed[0].Footer_Text, embed[0].Footer_Avatar_URL);
    }
    if (embed[0].Field_1_Title && embed[0].Field_1_Text) {
      newEmbed.addField(embed[0].Field_1_Title, embed[0].Field_1_Text);
    }
    if (embed[0].Field_2_Title && embed[0].Field_2_Text) {
      newEmbed.addField(embed[0].Field_2_Title, embed[0].Field_2_Text);
    }
    if (embed[0].Field_3_Title && embed[0].Field_3_Text) {
      newEmbed.addField(embed[0].Field_3_Title, embed[0].Field_3_Text);
    }
    if (embed[0].Field_4_Title && embed[0].Field_4_Text) {
      newEmbed.addField(embed[0].Field_4_Title, embed[0].Field_4_Text);
    }
    if (embed[0].Field_5_Title && embed[0].Field_5_Text) {
      newEmbed.addField(embed[0].Field_5_Title, embed[0].Field_5_Text);
    }
    return newEmbed;
  },
  Error: function(client, error) {
    const embed = new Discord.MessageEmbed()
      .setColor("#c70000")
      .setAuthor(
        "ERROR",
        "https://cdn.discordapp.com/attachments/717442783794692097/733268935310442556/Untitled-1.png"
      )
      .setDescription(error.stack);
    client.users.cache
      .get(process.env.OWNER)
      .send(client.user.username + embed);
  },
  Fortum: async function(client){
    const hourlyPrice = await axios.request({
        url: "https://fortum.heydaypro.com/tarkka/scripts/price_updater.php",
        method: "get"
      })
    client.user.setActivity(`Fortum: ${hourlyPrice.data.price} c/kWh`, { type: 'WATCHING' })
    
  },
  Inform: function(client, answer, message) {
    const embed = new Discord.MessageEmbed()
      .setColor("#ff930f")
      .setDescription(
        `[${message}](${message.url})\n**Bot:** ${answer.response}`
      );
    client.channels.cache.get(process.env.LOG).send(embed);
  },
  Mention: function(client, message, id) {
    const embed = new Discord.MessageEmbed()
      .setColor("#00c22a")
      .setAuthor(
        `${message.author.username} mentioned you in ${message.channel.name}`,
        message.author.displayAvatarURL()
      )
      .setDescription(`${message} \n [Link](${message.url})`);
    client.users.cache.get(id).send(embed);
  },
  RoleAdd: async function(client, reaction, user, id) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.log(error);
        return;
      }
    }
    const emojiId = reaction.emoji.id.toString();
    if (!user.bot && reaction.message.id === id) {
      if (
        set[client.user.username].rrRoles.hasOwnProperty(emojiId) ||
        set[client.user.username].rrRoles.hasOwnProperty(reaction.emoji.name)
      ) {
        reaction.message.guild
          .member(user)
          .roles.add(set[client.user.username].rrRoles[emojiId].role);
      }
    }
    if (set[client.user.username].rrAuto) {
      reaction.message.guild
        .member(user)
        .roles.add(set[client.user.username].rrAuto);
    }
  },
  RoleRemove: async function(client, reaction, user, id) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.log(error);
        return;
      }
    }
    const emojiId = reaction.emoji.id.toString();
    if (!user.bot && reaction.message.id === id) {
      if (
        set[client.user.username].rrRoles.hasOwnProperty(emojiId) ||
        set[client.user.username].rrRoles.hasOwnProperty(reaction.emoji.name)
      ) {
        reaction.message.guild
          .member(user)
          .roles.remove(set[client.user.username].rrRoles[emojiId].role);
      }
    }
  },
  Scheduler: async function(client, reaction, user) {
    if (reaction.partial && reaction.message.id === "781782602314285110") {
      await reaction.fetch();
    
    const ScrimEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Reaction Collector")
    const emoji = reaction.message.reactions.cache.map(emoji => emoji);
    for (var item in emoji) {
      ScrimEmbed.addField(
        "\u200B",
        emoji[item].emoji.name +
          " | " +
          emoji[item].users.cache.map(user => ` <@${user.id}>`)
      );
    }
    reaction.message.edit(ScrimEmbed);
      }
  },
  SpamStop: function(client, message, userMap, ignore_role) {
    if (message.channel.type == "dm") {
    } else {
      if (userMap.has(message.author.id)) {
        const userData = userMap.get(message.author.id);
        let msgCount = userData.msgCount;
        ++msgCount;
        if (parseInt(msgCount) === 5) {
          setTimeout(() => {
            message.reply(
              "Slow down buddy! If you want to chat to me that much let's move to DM!"
            );
          }, 2000);
        }
        if (parseInt(msgCount) === 10) {
          setTimeout(() => {
            message.reply("I don't wanna talk to you anymore. 😤");
          }, 3000);
          message.member.roles.add(ignore_role);
        } else {
          userData.msgCount = msgCount;
          userMap.set(message.author.id, userData);
        }
      } else {
        userMap.set(message.author.id, {
          msgCount: 1,
          timer: null
        });
        setTimeout(() => {
          userMap.delete(message.author.id);
        }, 40000);
      }
    }
  },
  SpreadsheetGET: async function(sheet_id, email, key) {
    const doc = new GoogleSpreadsheet(sheet_id);
    await doc.useServiceAccountAuth({
      client_email: email,
      private_key: key
    });

    await doc.loadInfo();
    return { doc };
  },
  SpreadsheetPOST: async function(sheet_id, tab, email, key, rowData) {
    const doc = new GoogleSpreadsheet(sheet_id);
    await doc.useServiceAccountAuth({
      client_email: email,
      private_key: key
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[tab];
    const moreRows = await sheet.addRows(rowData);
  }
};
