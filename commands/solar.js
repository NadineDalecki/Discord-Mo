const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
  name: "sol",
  async execute(client, message, args, set) {
    message.delete().catch(_ => {});
    if (client.user.username === "Mo") {
      const solarData = await axios.request({
        url:
          "https://www.solarweb.com/ActualData/GetCompareDataForPvSystem?pvSystemId=e3640d59-ec16-44b3-95b9-5cf7983eba1d",
        method: "get",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en",
          Connection: "keep-alive",
          Cookie:
            "BIGipServerp_pub_solarweb_www_https_pool=rd160o00000000000000000000ffff0aff0454o443; __RequestVerificationToken=6IENVXbZ3Xo2G4YWUAjmiL7kPEM0GXDgCiAt-kE-2WXO6Xe_hq3zoUaiofz3ae3XNstBU6CYoJLoP3SrLeLJvpyVq2M1; CookieConsent={stamp:%27ogycCuvFxxXk3MUVS8fqcMBYdjrBnjo31u0RU/PEPtWRJ+Sl5OK29g==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1607427394608%2Cregion:%27fi%27}; _ga=GA1.2.2087951136.1607427394; _gid=GA1.2.1113593014.1607427394; OpenIdConnect.nonce.87LMRnL0K18riS8zn2l%2BgQrsuCJ%2Bi%2BhiXBbVGdbgo7M%3D=QV96T0ctbEQ4enFBZ3VCaF9hN29sZWYzTjNqX2RMcjl1bmtiSGRvb2NBQzRCem9VY0g3VHpSQmtKVFppV2t5MDRpOURNcVhhcFVjek9YaUxsZVlmUm5ILVdQN2N3MFR0OENveDNrby1SNVJlUWZWM1hjd2V3d1pDUW9zNEpQeWpuMlRta3AtUWJJSkdCQ3YtM1BUUWNSdGVRanRsaHdIcnpJeXFpOVJsdjVBeVhEemJySlZHMnYwYXcyanRqX0lwSV9lRV9uUnlJQ3Rid0t1b1FHSEpweHN2SlNJ; OpenIdConnect.nonce.OCokYRXagKgyV3Ic1YxYDfcFCAlbATy979fxnbb2vx4%3D=bUlTT0UyWXhhejNtMGkwYjA1ZTlqSTd3VFRkcmpWVnFEc3FGajFsTDBMVDl0bktKaWZTSkhuZ3AwT294M1k4N1U4UjZMNl9KYWxHS2h6SkxnZWlCMTE1U3VZVmk3clFaTjlsY1d2ODM4RXViU1lUX2dQMjhlaHFkdjgxaV9Hckg0SWdhcGtlZWtIcHlWZTRjTUJrTTFwS3ZvVVlUTGNZckFDSklERUpVc3JBMzhtYm1fbmlhbTNmcWZ6ZFdHUm0tU05uTFFoTmotellsVm1ZU3R6akZqQWphZDJn; .AspNet.Auth=FTy22ftib4MYX26vlqGswB01rT99WDyFmXniE7gMvjUe-1ZAOWFCkEO3RSyk0_W0TuQrBNxLaLtQSVIPhlVyFpgHr9m1sV1J5-xKylYAo-_OQBhmQkcpxw4m8pfQfG-WqD6WwiboNBxn_ARMOPIdaEqmMTYuyhZJ27TFUDuqTIWu1EQTW8LWNrVDJrirXhC197B64EYmWnF14KYpAiBL6HVskZkV7X-EQo1_RUqtt-joa17_VdsuZprQNYVF7-MexZ0HL92qw55L1y9Ye9pA3kezV9nw6RFahgRTuSixzoN4b3rNSid9HpJqwRG4NQztTbAIr-sBXrYFS2D9c6nLBXIi6QOVFYWB9uHglbXviAzUWnKOE-V3hZo3hnOoII_xM-fbRg; TimeFormat=HH:mm; Culture=en; DateFormat=DD.MM.YYYY; TS01329c72=015bdaa268b2ea8d7c928f432644f68e08052c53b03ed450cb8fa444453d543c1d4f9bfae1cdabdd19e99ec82df6a82654aa609a749ac5912d71bc2f5984e02896037b3cb117b5a56537a6583fd9cb8f37b6a2865d731530cb404b0337f2a08b15c47ed6a4cd266110e2f7f13099e3bf33239c8f6d407a48c4298ec9f91c0d9747757fe5a027311cdef5220e5d504a31e62b27dac9e4a1c819bbb0e4bc2ba66905fed6f2b6521cdbb3221dc7104c910024a37c2047a7e9d609668f41d626a13c85d317754e; _gat_UA-77255390-2=1",
          DNT: 1,
          Host: "www.solarweb.com",
          Referer:
            "https://www.solarweb.com/PvSystems/PvSystem?pvSystemId=e3640d59-ec16-44b3-95b9-5cf7983eba1d",
          
        }
      });

      const weatherData = await axios.request({
        url:
          "http://api.openweathermap.org/data/2.5/weather?q=raisio&units=metric&appid=c53b99c632c6ed82d93ab74d8d0e54f5",
        method: "get"
      });

      const hourlyPrice = await axios.request({
        url:
          "https://fortum.heydaypro.com/tarkka/scripts/price_updater.php",
        method: "get"
      });
      
      
      
      if (solarData.data.IsOnline === false) {
        message.reply("Looks like the System is offline! 😭");
      } else if (solarData.data.IsOnline === true) {
        const solarEmbed = new Discord.MessageEmbed()
          .setURL(
            "https://www.solarweb.com/PvSystems/PvSystem?pvSystemId=e3640d59-ec16-44b3-95b9-5cf7983eba1d"
          )
          .setThumbnail(
            "http://openweathermap.org/img/wn/" +
              weatherData.data.weather[0].icon +
              "@2x.png"
          )
        .setAuthor("The Great Sunny North is online!")
          .setDescription(
            `The system is currently producing **${solarData.data.P_PV} w** during ${weatherData.data.weather[0].description} and ${weatherData.data.main.temp}° C\n\n**Current electricity price:** ${hourlyPrice.data.price} c/kWh`
          )
          .setTimestamp()
        message.reply(solarEmbed);
      }
    }
  }
};
