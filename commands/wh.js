const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
  name: "wh",
  async execute(client, message, args, set) {
    message.delete().catch(_ => {});

    const webhook = await axios.request({
      url:
        "https://discord.com/api/webhooks/725303751438761996/D66fH6FFVm1hKiS7Uj3bVyssCdN2cSIn9PMHAGvh1bY4UOld5hXmnjxUuVdFyAgXqo0q",
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        embeds: [
          {
            description: "The current electricity price is x c/kWh!",
            color: 3635820,

            image: {
              url:
                "https://task-data-api.eu1.robocloud.eu/bin-v1/runs/123d2b99-1484-4dc2-a9af-0bef0b1898de/artifacts/547f24d5-e4f1-4ae5-8955-a62496882f8a/fortum_graph.png?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlJZCI6InRva2VuX3ZlbmRvcl8wIiwid29ya3NwYWNlSWQiOiJiNWI0MDYyZC01Y2M5LTQzMTMtOGE3OC0xZTZlNGVkODM2N2MiLCJjYXBhYmlsaXRpZXMiOnsiYXJ0aWZhY3QiOnsicmVhZCI6dHJ1ZX19LCJpYXQiOjE2MTIyNzAzNzQsImV4cCI6MTYxMjI3MDY3NCwiaXNzIjoicm9ib2NvcnAvdG9rZW4tdmVuZG9yIn0.MEUCIQCkID39taiRi9HUGoJTk08dOwfns0mUaXqMBUpBtcK8yQIgepWAiWrsoSC6CuwbQbzzsPvfoZheGKhXriXHWq-QnB0"
            }
          }
        ]
      }
    });
  }
};
