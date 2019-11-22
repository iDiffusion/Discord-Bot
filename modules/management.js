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
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16721408, 3);
    return;
  }
  try {
    let userToBan = base.msg.mentions.users.first();
    let banMsg = base.args.slice(2).join(" ");
    base.msg.guild.member(userToBan).ban();
    sendToDM(base.msg, "Banned", 16721408, userToBan, banMsg);
    sendToModlog(base.msg, "Banned", 16721408, userToBan, banMsg);
    usersRemoved.push(userToBan);
  } catch (e) {
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16721408, 3);
    return;
  }
}

function kick(base, usersRemoved) {
  if (base.args.length < 3) {
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16733186, 3);
    return;
  }
  try {
    let userToKick = base.msg.mentions.users.first();
    let kickMsg = base.args.slice(2).join(" ");
    base.msg.guild.member(userToKick).kick();
    sendToDM(base.msg, "Kicked", 16733186, userToKick, kickMsg);
    sendToModlog(base.msg, "Kicked", 16733186, userToKick, kickMsg);
    usersRemoved.push(userToKick);
  } catch (e) {
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16733186, 3);
    return;
  }
}

function move(base) {
  try {
    let fromChannel = base.msg.guild.channels.get(base.args[1]);
    let toChannel = base.msg.guild.channels.get(base.args[2]);
    let mem_array = fromChannel.members.array();
    mem_array.map(user => base.msg.guild.member(user).setVoiceChannel(toChannel));
  } catch (e) {
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 3447003, 3);
    return;
  }
}

function prune(base, usersRemoved) {
  try {
    base.msg.guild.pruneMembers(parseInt(base.args[1]), true, "Removed for inactivity")
    .then(pruned => {
      base.utils.sendEmbed(base.msg, `I just pruned ${pruned} members!`, 16733186, 3);
    });
  } catch (e) {
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16733186, 3);
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
    return base.utils.noArgsFound(base);
  }
}

function softban(base, usersRemoved) {
  if (base.args.length < 3) {
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16733186, 3);
    return;
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
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16733186, 3);
  }
}

function warnMembers(base) {
  if (base.args.length < 3) {
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16774400, 3);
    return;
  }
  try {
    let userToWarn = base.msg.mentions.users.first();
    let warnMsg = base.args.slice(1).join(" ");
    sendToDM(msg, "Warned", 16774400, userToWarn, warnMsg);
    sendToModlog(msg, "Warned", 16774400, userToWarn, warnMsg);
  } catch (e) {
    base.utils.sendEmbed(base.msg, base.utils.noArgsFound(base), 16774400, 3);
  }
}

//-----------------------------------| Member Events |---------------------------------------
exports.memberAdded = (mem, config, usersRemoved) => { //New member joined
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
};

exports.memberRemoved = (mem, config, usersRemoved) => { //Member leaves/kicked
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
}

exports.memberBanned = (mem, guild, usersRemoved) => { //Member Ban
  let channel = guild.channels.find(x => x.name == "mod_log");
  channel = channel ? channel : guild.channels.find(x => x.name == "general");
  channel = channel ? channel : guild.channels[0];
  channel.send({
    embed: {
      color: 6546816,
      author: {
        name: mem.displayName + "#" + mem.user.discriminator,
        icon_url: user.user.avatarURL
      },
      title: `${mem.id.toString()} | User Banned`,
      description: `User: ${mem.user} was banned`,
      timestamp: new Date()
    }
  });
  usersRemoved.push(mem);
}

exports.memberUpdated = (newMem, oldMem) => {
  return;
}
