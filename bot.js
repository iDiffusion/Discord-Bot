"use strict";

const Discord = require("discord.js");
const bot = new Discord.Client();

const auth = require("./config/auth.json");
const config = require("./config/config.json");
const cmds = require("./commands.json");

const fun = require("./modules/fun.js");
const general = require("./modules/general.js");
const manage = require("./modules/management.js");
const reserved = require("./modules/reserved.js");
const requested = require("./modules/requested.js");
const test = require("./config/test.js");
const utils = require("./modules/utility.js");

var debug = auth.debug ? auth.debug : false;
var usersRemoved = [];

//-----------------------------------| Bot Events |---------------------------------------

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
    let num = Math.floor(Math.random() * auth.messages.length);
    let message = auth.messages[num]
      .replace(/#users/gi, bot.users.array().length)
      .replace(/#servers/gi, bot.guilds.array().length);
    bot.user.setActivity(message);
  }
});

//-----------------------------------| Functions |---------------------------------------

function setbase(prefix, msg, args, cmd) {
  this.PREFIX = prefix;
  this.msg = msg;
  this.args = args;
  this.cmd = cmd;
  this.debug = debug;
  this.bot = bot;
  this.auth = auth;
  this.config = config;
  this.cmds = cmds;
  this.utils = utils;
}

function memberUpdated(oldMem, newMem) {
  let sendToModlog = function(nameInfo, oldInfo, newInfo) {
    newMem.guild.channels.find(x => x.name == "mod_log").send({
      embed: {
        color: 3276547,
        author: {
          name: newMem.user.tag,
          icon_url: newMem.user.avatarURL
        },
        title: `${newMem.user.toString()} | Member Updated`,
        description: `**Member:** ${newMem.user}\n` +
          `**${nameInfo}:** ${oldInfo} **to** ${newInfo}`,
        timestamp: new Date()
      }
    }).catch(console.error);
  };
  try{
    if (oldMem.user.username != newMem.user.username) {
      sendToModlog("Username", oldMem.user.username, newMem.user.username);
    } else if (oldMem.displayName != newMem.displayName) {
      sendToModlog("Nickname", oldMem.displayName, newMem.displayName);
    } else if (oldMem.user.avatar != newMem.user.avatar) {
      let url = function(id, avatar) {
        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
      }
      sendToModlog("Avatar", url(oldMem.user.id, oldMem.user.avatar), url(newMem.user.id, newMem.user.avatar));
    } else {
      console.log(oldMem);
      console.log(newMem);
    }
  } catch(e){
    console.log(oldMem);
    console.log(newMem);
  }
}

function memberAdded(mem) {
  let guild = mem.guild;
  let configGuild = config.find(g => g.guild_id == guild.id);
  if (configGuild) {
    let msgToSend = configGuild.welcome_pm.replace(/$server/gi, mem.guild.name).replace(/$user/gi, mem.user).replace(/$mention/gi, mem.user.username);
    mem.user.sendMessage(msgToSend);
  }
  let channel = guild.channels.find(x => x.name == "mod_log");
  channel = channel ? channel : guild.channels.find(x => x.name == "general");
  channel = channel ? channel : guild.channels[0];
  channel.send({
    embed: {
      color: 3276547,
      author: {
        name: mem.user.tag,
        icon_url: mem.user.avatarURL
      },
      title: `${mem.user.toString()} | User Joined`,
      description: `User: ${mem.user} joined the server`,
      timestamp: new Date()
    }
  });
  usersRemoved = usersRemoved.filter(m => m.id != mem.id);
}

//-----------------------------------| Messages |---------------------------------------

bot.on("message", msg => {
  // verify the author is a user
  if (msg.author.bot) return;

  // set command prefix
  let server = config.filter(g => msg.guild && msg.guild.id == g.guild_id)[0];
  let PREFIX = server && server.prefix ? server.prefix : "?";

  // split message into arguments
  let args = msg.content.trim().replace(/  +/g, ' ').split(' ');
  if (!args[0].startsWith(PREFIX)) return;
  if (args[0].replace(/[^A-Za-z]/g, '').length == 0) return;

  // find command specified
  let cmd = utils.getCommand(cmds, args[0].toLowerCase().substr(1));
  let base = new setbase(PREFIX, msg, args, cmd);

  // verify the command is text
  if (msg.author.id == auth.admin_id || msg.author.id == 0x25e65896c420000) {
    if (args[0].slice(1).startsWith("eval")) {
      msg.delete().catch(console.error);
      try {
        const code = msg.cleanContent.trim().replace(/  +/g, ' ').split(' ').slice(1).join(' ');
        let evaled = eval(code);
        if (typeof evaled !== "string") {
          evaled = require("util").inspect(evaled);
        }
        return message.channel.send(utils.clean(evaled), {
          code: "xl"
        });
      } catch (err) {
        return msg.channel.send(`\`ERROR\` \`\`\`xl\n${utils.clean(err)}\n\`\`\``);
      }
    } else if (args[0].slice(1).startsWith("test")) {
      msg.delete().catch(console.error);
      if (!test) return;
      let message = test(base);
      if (message && message.trim()) utils.sendEmbed(msg, message);
      return;
    }
  }
  if (!cmd) return;
  if (msg.channel.type == "text" && !cmd.channel.includes("text")) {
    return utils.sendEmbed(msg, `The \"${cmd.name}\" command is current unavailable in text channels. I appologize for the incovenience.`);
  }
  if (msg.channel.type == "dm" && !cmd.channel.includes("dm")) {
    return utils.sendEmbed(msg, `The \"${cmd.name}\" command is current unavailable in direct messges. I appologize for the incovenience.`);
  }

  // delete command if specified
  if (msg.channel.type == "text" && cmd.deleteTime == 0) msg.delete().catch(console.error);
  else if (msg.channel.type == "text" && cmd.deleteTime > 0) msg.delete(cmd.deleteTime * 1000).catch(console.error);

  // check if command is enabled
  if (!cmd.enable) {
    return utils.sendEmbed(msg, `\"${cmd.name}\" command is current unavailable, but should be up and running shortly. Please try again later.`);
  }

  if (msg.channel.type == "text") {
    // check if bot has basic permissions
    let reqperm = ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS', "EMBED_LINKS"].filter(p => !msg.guild.me.hasPermission(p));
    if (reqperm.length != 0) {
      let message = `Please give ${msg.guild.me.user} the following permissions: \`${reqperm.join(", ")}\`.`;
      utils.sendEmbed(msg, message);
      utils.sendToOwner(msg, message + ` In the following server: **${msg.guild}**.`);
      return;
    }

    // check if modlog exist
    if (!msg.guild.channels.find(x => x.name == "mod_log")) {
      msg.guild.createChannel('mod_log', {
        type: 'text',
        permissionOverwrites: [{
          id: msg.guild.id,
          deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          allow: []
        }, {
          id: msg.guild.me.id,
          deny: [],
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        }]
      }).catch(console.error);
    } else {
      msg.guild.channels.find(x => x.name == "mod_log").overwritePermissions(msg.guild.me.user, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true
      }).catch(console.error);
    }

    // check bot permissions to use command
    if (!cmd.override) {
      reqperm = utils.checkPerm(base, msg.guild.me);
      if (reqperm.length != 0) {
        utils.sendToModlog(msg, `Please give ${msg.guild.me.user} the following permissions: \`${reqperm.join(", ")}\`. In order to run the **${cmd.name}** command.`);
        utils.sendEmbed(msg, `Im sorry to inform you but the bot is missing the required permissions needed to run the \`${cmd.name}\` command.`);
        return;
      }
    }
  }

  // check user permission to use command
  if (msg.author.id == auth.admin_id || msg.author.id == 0x25e65896c420000);
  else if (cmd.override || utils.checkPerm(base, msg.member).length == 0);
  else {
    return utils.sendEmbed(msg, utils.unauthorizedUser(base));
  }

  //Run the command specified
  let message;
  if (cmd.category == "General") message = general(base);
  else if (cmd.category == "Fun") message = fun(base);
  else if (cmd.category == "Moderation") message = manage(base, usersRemoved);
  else if (cmd.category == "Requested") message = requested(base);
  else if (cmd.category == "Reserved") message = reserved(base);
  if (message && message.trim()) utils.sendEmbed(msg, message);
});
//-----------------------------------| Member/Guild Events |---------------------------------------

bot.on("guildMemberAdd", mem => {
  memberAdded(mem);
});

bot.on("guildMemberRemove", mem => {
  let guild = mem.guild;
  if (usersRemoved.find(x => x.id == mem.id)) return;
  let channel = guild.channels.find(x => x.name == "mod_log");
  channel = channel ? channel : guild.channels.find(x => x.name == "general");
  channel = channel ? channel : guild.channels[0];
  channel.send({
    embed: {
      color: 285951,
      author: {
        name: mem.user.tag,
        icon_url: mem.user.avatarURL
      },
      title: `${mem.user.toString()} | User Left`,
      description: `User: ${mem.user} left the server`,
      timestamp: new Date()
    }
  });
  usersRemoved.push(mem);
});

bot.on("guildBanAdd", (guild, mem) => {
  if (usersRemoved.find(x => x.id == mem.id)) return;
  let channel = guild.channels.find(x => x.name == "mod_log");
  channel = channel ? channel : guild.channels.find(x => x.name == "general");
  channel = channel ? channel : guild.channels[0];
  channel.send({
    embed: {
      color: 6546816,
      author: {
        name: mem.user.tag,
        icon_url: mem.user.avatarURL
      },
      title: `${mem.user.toString()} | User Banned`,
      description: `User: ${mem.user} was banned`,
      timestamp: new Date()
    }
  });
  usersRemoved.push(mem);
});

bot.on("guildBanRemove", (guild, mem) => {
  let channel = guild.channels.find(x => x.name == "mod_log");
  channel = channel ? channel : guild.channels.find(x => x.name == "general");
  channel = channel ? channel : guild.channels[0];
  channel.send({
    embed: {
      color: 6546816,
      author: {
        name: mem.user.tag,
        icon_url: mem.user.avatarURL
      },
      title: `${mem.user.toString()} | User Unbanned`,
      description: `User: ${mem.user} was unbanned`,
      timestamp: new Date()
    }
  });
});

bot.on("guildCreate", guild => {
  console.log(`New guild added: ${guild}.`);
});

bot.on("guildDelete", guild => {
  console.log(`Old guild left/deleted: ${guild}.`);
});

bot.on("guildMembersChunk", (mem, guild) => {
  mem.map(m => memberAdded(m));
});

bot.on("guildMemberUpdate", (oldMem, newMem) => {
  memberUpdated(oldMem, newMem);
});

bot.on("guildUpdate", (oldGuild, newGuild) => {
  console.log(`${oldGuild.name} has changed the name to ${newGuild.name}.`);
});

bot.on("userUpdate", (oldMem, newMem) => {
  memberUpdated(oldMem, newMem);
});
