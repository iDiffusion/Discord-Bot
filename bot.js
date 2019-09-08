"use strict";

const Discord = require("discord.js");
const bot = new Discord.Client();

const auth = require("./auth.json");
const config = require("./config.json");
const cmds = require("./commands.json");

const utils = require("./modules/utility.js");
const fun = require("./modules/fun.js");
const basic = require("./modules/basic.js");
const reserved = require("./modules/reserved.js");
const manage = require("./modules/management.js");

var usersRemoved = [];
var msg4log = [];
bot.login(auth.token);
bot.on('error', e => {
  console.error(e);
});
bot.on('warn', e => {
  console.warn(e);
});
bot.on('disconnect', () => {
  console.log('Celestial has left the building!');
});
bot.on('reconneting', () => {
  console.log('Attempting to find Celestial.');
});
bot.on('resume', () => {
  console.log('Celestial has been located.');
});

bot.on('ready', () => {
  console.log('Celestial is ready to serve!');
  if (auth.debug) {
    bot.user.setActivity('with code');
  } else {
    let array = auth.messages;
    let num = Math.floor(Math.random() * array.length);
    let message = array[num].replace(/#users/gi, bot.users.array().length);
    bot.user.setActivity(message);
  }
});

function getCommand(cmdName) {
  let commands = cmds.cmds.filter(cmd => {
    return cmd.alias.filter(p => p.trim().toLowerCase() == cmdName.trim().toLowerCase()).length > 0;
  });
  return commands[0];
}

bot.on("message", msg => {
  // if (auth.debug) {
  //   console.log(msg);
  // }

  if (msg.author.bot) return;

  let PREFIX = config.channels.filter(g => g.guild_id == msg.guild.id)[0];
  if (PREFIX == undefined) {
    PREFIX = auth.default.prefix;
  } else {
    PREFIX = PREFIX.prefix;
  }

  let args = msg.content.trim().replace(/  +/g, ' ').split(' ');
  if (!args[0].startsWith(PREFIX)) return;
  if (args[0].startsWith(PREFIX + ' ')) return;

  let cmd = getCommand(args[0].toLowerCase().substr(1));
  if (!cmd) return;

  let reqperm = ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS'].filter(p => !msg.guild.me.hasPermission(p));
  if (reqperm.length != 0) {
    return msg.guild.owner.send(`Please give ${msg.guild.me.user} the following permissions: \`${reqperm}\`. In the following server: **${msg.guild}**.`).catch(console.error);
  }

  if (!msg.guild.channels.find(x => x.name == "mod_log")) {
    msg.guild.createChannel('mod_log', {
        type: 'text',
        permissionOverwrites: [{
          id: msg.guild.id,
          deny: ['VIEW_CHANNEL'],
          allow: []
        }]
      })
      .then(console.log)
      .catch(console.error);
  }

  if (cmd.delete == 0) msg.delete().catch(console.error);

  if (!cmd.enable) {
    return msg.channel.send(`\"${cmd.name}\" command is current unavailable, but should be up and running shortly. Please try again later.`);
  }

  if (cmd.category != 'Reserved') {
    let reqperm = cmd.permission.filter(p => !msg.guild.me.hasPermission(p));
    if (reqperm != 0) {
      msg.guild.channels.find(x => x.name == "mod_log").send(`Please give ${msg.guild.me.user} the following permissions: \`${reqperm.join(", ")}\`. In order to run the following command: **${cmd.name}**.`).catch(console.error);
      return msg.channel.send(`Im sorry to inform you but the bot is missing the required permissions needed to run this comamnd: \`${cmd.name}\`.`);
    }
  }

  if (msg.author.id == 170685476787847168);
  else if (cmd.category == 'Reserved');
  else if (cmd.permission.filter(p => msg.guild.member(msg.author).hasPermission(p)).length == cmd.permission.length);
  else {
    return msg.channel.send(`Im sorry to inform you but you are missing one or more of the requried permissions needed to run this command: \`${cmd.name}\`.`);
  }

  //TODO go to command category to preform command;

});

bot.on("guildMemberAdd", mem => {
  let guild = mem.guild;
  manage.memberAdded(mem, guild, config);
});

bot.on("guildMemberRemove", mem => {
  let guild = mem.guild;
  manage.memberRemoved(mem, guild, usersRemoved);
});

bot.on("guildBanAdd", (guild, mem) => {
  manage.memberBanned(mem, guild, usersRemoved);
});

bot.on("guildBanRemove", (guild, mem) => {
  mamange.memberUnbanned(mem, guild, usersRemoved);
});

bot.on("guildCreate", guild => {
  console.log(`New guild added: ${guild}.`);
});

bot.on("guildDelete", guild => {
  console.log(`Old guild left/deleted: ${guild}.`);
});

bot.on("guildMembersChunk", (mem, guild) => {
  mem.map(m => manage.memberAdded(m, guild, config));
});

bot.on("guildMemberUpdate", (oldMem, newMem) => {
  manage.memberUpdated(oldMem, newMem);
});

bot.on("guildUpdate", (oldGuild, newGuild) => {
  console.log(`${oldGuild.name} has changed the name to ${newGuild.name}.`);
});

bot.on("userUpdate", (oldMem, newMem) => {
  manage.memberUpdated(oldMem, newMem);
});
