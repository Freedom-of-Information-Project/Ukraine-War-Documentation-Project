


const { Client, Message } = require("discord.js");

const client = new Client({
    restTimeOffset: 0,
    shards: "auto",
    intents: 641,
  });
  const { MessageAttachment, MessageEmbed } = require('discord.js');

  module.exports = async (client, message, cmd, args) => {


let infocmd = new MessageEmbed()

.setAuthor(`freedom of information prject`)
.setDescription(`Freedom Of Information Project
Information Is A Human Right

VIEW THE SITE: https://tudbut.de/

A NoScript website that updates with content from Ukraine and Russian related combat and informaiton subreddits

Sources
- r/WW3
- r/CombatFootage
- r/russia
- r/ukraine
- r/UkraineWarReports
- r/RussianWarCrimes
- r/RussiaUkraineWar2022
- r/RussianWarSecrets
- r/UkrainianConflict

Sources Update Every 10 Seconds

We Will Be Soon Moving To A Tor Hidden Service To Improve The Anonymity Of Our Users
This has been written in server-side JavaScript to allow the use of NoScript
 
`)

if (cmd === "info") {

    message.channel.send({embeds : [infocmd]});


}


else if (cmd === "ping") {

let latencycmd = new MessageEmbed()

.setAuthor(`site ping`)
.setDescription(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);


    message.channel.send({ embeds : [latencycmd]});

  }
}


