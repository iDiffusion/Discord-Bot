"use strict";

module.exports = function(base, usersRemoved) {
  if (base.cmd.name == "ban") return ban(base, usersRemoved);
  else if (base.cmd.name == "kick") return kick(base, usersRemoved);
  else if (base.cmd.name == "move") return move(base);
  else if (base.cmd.name == "mute") return mute(base);
  else if (base.cmd.name == "prune") return prune(base, usersRemoved);
  else if (base.cmd.name == "purge") return purge(base);
  else if (base.cmd.name == "softban") return softban(base, usersRemoved);
  else if (base.cmd.name == "warn") return warn(base);
}

function sendToModlog(msg, action, color, user, message) {
  try {
    msg.guild.channels.find("name", "mod_log").send({
      embed: {
        color: color,
        author: {
          name: user.username,
          icon_url: user.avatarURL
        },
        title: `User ${action}`,
        description: `${msg.author} has ${action.toLowerCase()} ${user}`,
        fields: [{
          name: `Reason`,
          value: message
        }],
        timestamp: new Date()
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function sendToDM(msg, action, color, user, message) {
  let man = msg.member.hasPermission("ADMINISTRATOR") ? "Admin" : "Mod";
  try {
    msg.guild.member(user).send({
      embed: {
        color: color,
        author: {
          name: msg.guild.name,
          icon_url: msg.guild.iconURL
        },
        title: `User ${action}`,
        description: `You have been ${action.toLowerCase()} by an ${man}`,
        fields: [{
          name: 'Reason',
          value: message
        }],
        timestamp: new Date()
      }
    });
  } catch (e) {
    console.log(e);
  }
}

//-----------------------------------| Commands |---------------------------------------

function ban(base, usersRemoved) {
  if (base.args.length < 3) {
    return base.utils.noArgsFound(base);
  }
  try {
    let userToBan = base.msg.mentions.users.first();
    let banMsg = base.args.slice(2).join(" ");
    base.msg.guild.member(userToBan).ban();
    sendToDM(base.msg, "Banned", 16721408, userToBan, banMsg);
    sendToModlog(base.msg, "Banned", 16721408, userToBan, banMsg);
    usersRemoved.push(userToBan);
  } catch (e) {
    return base.utils.noArgsFound(base);
  }
}

function kick(base, usersRemoved) {
  if (base.args.length < 3) {
    return base.utils.noArgsFound(base);
  }
  try {
    let userToKick = base.msg.mentions.users.first();
    let kickMsg = base.args.slice(2).join(" ");
    base.msg.guild.member(userToKick).kick();
    sendToDM(base.msg, "Kicked", 16733186, userToKick, kickMsg);
    sendToModlog(base.msg, "Kicked", 16733186, userToKick, kickMsg);
    usersRemoved.push(userToKick);
  } catch (e) {
    return base.utils.noArgsFound(base);
  }
}

function moveMembers(base) {
  if (msg.channel.type == 'dm') { // Limit to guilds only
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  } else if (!msg.guild.member(bot.user).hasPermssion("MOVE_MEMBERS")) { //check if bot has permission to move members
    return msg.channel.sendMessage("Unable to complete request to move members, I don't have the necessary permissions `MOVE_MEMBERS`\n An admin or server owner must change this before you are able to user this command.`");
  }
  if (!msg.member.hasPermission("MOVE_MEMBERS")) { //limit to members taht have permission
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}move `);
  } else if (args.length < 2 || isNaN(args[0]) || isNaN(args[1])) { //check for all fields
    msg.channel.sendMessage(`You did not define enough arguments. Usage: \`${PREFIX}move [VC from ID] [VC to ID]`);
    return deleteAfterTime(msg, 2000, 2);
  }
  let mem_array = msg.guild.channels.get(args[0]).members.array();
  let fromChannel = msg.guild.channels.get(args[0]);
  let toChannel = msg.guild.channels.get(args[1]);
  if (mem_array.length == 0 && fromChannel) { //check that members are in from channel
    msg.channel.sendMessage(`Currently there are no members in ${fromChannel.name}. Usage: \`${PREFIX}move [VC from ID] [VC to ID]\``);
    return deleteAfterTime(msg, 2000, 2);
  } else if (!fromChannel || fromChannel.type != "text") { //check that from channel exist
    msg.channel.sendMessage("From channel ID doesnt match a text channel from this server. Please try again.");
    return deleteAfterTime(msg, 2000, 2);
  } else if (!toChannel || toChannel.type != "text") { //check taht to channel exist
    msg.channel.sendMessage("To channel ID doesnt match a text channel from this server. Please try again.");
    return delteAfterTime(msg, 2000, 2);
  }
  try {
    msg.delete().catch(console.error);
    mem_array.map(id => msg.guild.member(id).setVoiceChannel(msg.guild.channels.get(args[1])));
  } catch (e) {
    msg.channel.sendMessage("One of the provided channel ID's does not exist. Please make sure that the numbers provided are ID's");
    deleteAfterTime(msg, 3000, 1);
  }
}

function prune(base, usersRemoved) {
  let args = msg.content.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", cmdChannelName);
  if (msg.channel.type == "dm") { //limit to guilds only
    return msg.reply("Unable to use this command in private chat.");
  } else if (!msg.guild.member(bot.user).hasPermssion("KICK_MEMBERS")) { //check if bot has permission to kick members
    return msg.channel.sendMessage("Unable to complete request to move members, I don't have the necessary permissions `KICK_MEMBERS`\n An admin or server owner must change this before you are able to user this command.`");
  } else if (cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  } else if (!msg.member.hasPermission("KICK_MEMBERS")) { //limit to members that can kick memebrs
    badUserToModlog(msg, "prune");
    return msg.reply(`You pleb, you don't have permission to use this command \`${PREFIX}prune\`.`);
  } else if (args.length != 1 || isNan(args[0])) { //check for all fields
    msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}prune [days]\``);
  }
  try { //check if args[0] is a number
    msg.guild.pruneMembers(arg[0], false, "Removed for inactivity").then(pruned => {
      if (modlog) {
        modlog.sendMessage(`I just pruned ${pruned} members!`);
      } else {
        msg.channel.sendMessage(`I just pruned ${pruned} members!`);
      }
    });
  } catch (e) {
    msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}prune [days]\``);
    deleteAfterTime(msg, 2000, 2);
    console.error(e);
  }
}

function purge(base) {
  if (base.args.length == 1 || isNaN(base.args[1])) {
    return base.utils.noArgsFound(base);
  }
  let reqperm = base.utils.checkPerm(base, base.msg.guild.me);
  if (reqperm.length != 0) {
    utils.sendToModlog(msg, `Please give ${base.msg.guild.me.user} the following permissions: \`${reqperm.join(", ")}\`. In order to run the **${base.cmd.name}** command.`);
    return `Im sorry to inform you but the bot is missing the required permissions needed to run the \`${base.cmd.name}\` command.`;
  }
  try {
    let man = base.msg.member.hasPermission("MANAGE_MESSAGES");
    let num = parseInt(base.args[1]);
    let user = base.msg.mentions.users.first();
    base.msg.channel.fetchMessages({
      limit: 100,
      before: base.msg.id
    }).then(msg => {
      let msg_array = msg.array();
      if (!man) msg_array = msg_array.filter(m => m.author.id == base.msg.author.id);
      if (user) msg_array = msg_array.filter(m => m.author.id == user.id);
      msg_array.length = num;
      msg_array.map(m => m.delete().catch(console.error));
    });
    base.utils.sendEmbed(base.msg, `${num} messages have been deleted.`, 3447003, 3);
  } catch (err) {
    console.log(err);
    return base.utils.noArgsFound(base);
  }
}

function softban(base, usersRemoved) {
  if (base.args.length < 3) {
    return base.utils.noArgsFound(base);
  }
  try {
    let userToKick = base.msg.mentions.users.first();
    let kickMsg = base.args.slice(2).join(" ");
    base.msg.guild.member(userToKick).ban(kickMsg);
    base.msg.guild.member(userToKick).unban("Softban Only")
    sendToDM(base.msg, "Soft Banned", 16733186, userToKick, kickMsg);
    sendToModlog(base.msg, "Soft Banned", 16733186, userToKick, kickMsg);
    usersRemoved.push(userToKick);
  } catch (e) {
    return base.utils.noArgsFound(base);
  }
}

function warnMembers(base) {
  let args = msg.cleanContent.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", "commands");
  if (msg.channel.type == 'dm') { //limit to guilds only
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  } else if (cmdChat && msg.channel.name != "commands") { //limit to command chat if exist
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  } else if (!msg.member.hasPermission("MUTE_MEMBERS") && !msg.member.hasPermission("DEAFEN_MEMBERS")) { //limit to memebrs that can mute or deafen members
    badUserToModlog(msg, "Warn");
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}warn\``);
  } else if (args.length < 2) { //check for all fields
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}warn [user] [reason]\``);
  }
  msg.delete().catch(console.error);
  let userToWarn = msg.mentions.users.first();
  let warnMsg = args.slice(1).join(" ");
  if (sendToDM(msg, "Warned", 16774400, userToWarn, warnMsg)) { // check if user exist
    if (!sendToModlog(msg, "Warned", 16774400, userToWarn, warnMsg)) {
      msg.channel.sendMessage("Unable to find **#mod_log** text channel, please consult an admin or server owner.")
    }
  } else {
    msg.channel.sendMessage(`Please **@mention** a user to kick. **${args[0]}** is not a mention.`);
    deleteAfterTime(msg, 2000, 2);
    console.log(e);
  }
}

//-----------------------------------| Member Events |---------------------------------------
exports.memberAdded = (mem, guild, config) => { //New member joined
  if (config.welcome_pm) {
    let msgToSend = config.welcome_pm.replace(/$server/gi, mem.guild.name).replace(/$user/gi, mem.user).replace(/$mention/gi, mem.user.username);
    msgToSend = msgToSend.split(" ").map(word => {
      if (word.startsWith("#")) {
        let channel = mem.guild.channels.find("name", word.substr(1));
        word = channel ? channel : word;
      }
    });
    mem.user.sendMessage(msgToSend);
  }
  if (config.welcome_msg) {
    let msgToSend = config.welcome_msg.replace(/$server/gi, mem.guild.name).replace(/$user/gi, mem.user).replace(/$mention/gi, mem.user.username);
    mem.guild.channels.find("name", "general").sendMessage(msgToSend);
  }
  var modlog = mem.guild.channels.find("name", "mod_log");
  if (!modlog) {
    modlog = mem.guild.defaultChannel;
  }
  modlog.sendEmbed({
    color: 3276547,
    author: {
      name: mem.displayName + "#" + mem.user.discriminator,
      icon_url: mem.user.avatarURL
    },
    title: `${mem.user.toString()} | User Joined`,
    description: `User: ${mem.user} joined the server`,
    timestamp: new Date()
  });
}

exports.memberRemoved = (mem, guild, usersRemoved) => { //Member leaves/kicked
  let length = usersRemoved.length;
  usersRemoved = usersRemoved.filter(member => usersRemoved.indexOf(mem) == -1);
  if (usersRemoved.length != length) {
    return usersRemoved;
  }
  var modlog = mem.guild.channels.find("name", "mod_log");
  if (!modlog) {
    modlog = mem.guild.defaultChannel;
  }
  modlog.sendEmbed({
    color: 285951,
    author: {
      name: mem.displayName + "#" + mem.user.discriminator,
      icon_url: mem.user.avatarURL
    },
    title: `${mem.user.toString()} | User Left`,
    description: `User: ${mem.user} left the server`,
    timestamp: new Date()
  });
  return usersRemoved;
} //End member mod_log

exports.memberBanned = (mem, guild, usersRemoved) => { //Member Ban
  let length = usersRemoved.length;
  usersRemoved = usersRemoved.filter(member => userRemoved.indexOf(mem) == -1);
  if (usersRemoved.length != length) {
    return usersRemoved;
  }
  var modlog = mem.guild.channels.find("name", "mod_log");
  if (!modlog) {
    modlog = mem.guild.defaultChannel;
  }
  modlog.sendEmbed({
    color: 6546816,
    author: {
      name: mem.displayName + "#" + mem.user.discriminator,
      icon_url: user.user.avatarURL
    },
    title: `${mem.id.toString()} | User Banned`,
    description: `User: ${mem.user} was banned`,
    timestamp: new Date()
  });
}

exports.memberUpdated = (newMem, oldMem) => {
  return;
}
