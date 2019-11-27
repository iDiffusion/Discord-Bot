"use strict";

module.exports = function(base) {
  if (base.cmd.name == "apply") return apply(base);
  else if (base.cmd.name == "clean") return clean(base);
  else if (base.cmd.name == "donate") return donate(base);
  else if (base.cmd.name == "giveaway") return giveaway(base);
  else if (base.cmd.name == "help") return help(base);
  else if (base.cmd.name == "info") return info(base);
  else if (base.cmd.name == "invite") return invite(base);
  else if (base.cmd.name == "letsplay") return letsplay(base);
  else if (base.cmd.name == "say") return say(base);
  else if (base.cmd.name == "tabletop") return tabletop(base);
}

function apply(base) {
  let args = base.msg.cleanContent.trim().replace(/  +/g, ' ').split(' ');
  let reasonFor = args.slice(2).join(" ");
  if (args.length <= 2) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
  let role = base.msg.guild.roles.find(r => args[1].toLowerCase().includes(r.name.toLowerCase()));
  if (!role) {
    return `Im sorry to inform you but you must have at least one role in order to run this command: \`${base.cmd.name}\`.`;
  }
  base.msg.guild.channels.find(c => c.name == "mod_log").send({
    embed: {
      color: 7013119,
      author: {
        name: base.msg.author.username,
        icon_url: base.msg.author.avatarURL
      },
      title: 'Role Application',
      description: `${base.msg.author} has applied for the **${role.name}** Role`,
      fields: [{
        name: 'Reason',
        value: reasonFor
      }],
      timestamp: new Date()
    }
  }).catch(console.error);
};

function clean(base) {
  base.msg.channel.fetchMessages().then(msgs => {
    let msg_array = msgs.filter(m => m.author.id == base.bot.user.id);
    msg_array.array().map(m => m.delete().catch(console.error));
  });
};

function donate(base) {
  let donate_link = base.auth.donate_link ? base.auth.donate_link : "https://www.paypal.me/ikaikalee";
  return `If you would like to make any donations, please use the following link:\n${donate_link}`;
}

function giveaway(base) {
  //TODO change to message.createReactionCollector(filter, [option]);
  let message = base.msg.channel.fetchMessage(base.args[1])
    .then(msg => msg.reactions)
    .then(reactions => {
      reactions.array().map(react => {
        //TODO get users from reaction
      })
    })
    .catch(console.error);
  return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
};

function help(base) {
  try {
    let cmd = base.utils.getCommand(base.cmds, base.args[1].toLowerCase());
    base.msg.channel.send({
      embed: {
        color: 3447003,
        title: `Command: ${cmd.name}`,
        description: `**Alias:** ${cmd.alias.join(", ")}\n` +
          `**Description:** ${cmd.description}\n` +
          `**Category:** ${cmd.category}\n` +
          `**Permissions:** [${cmd.permission.join(", ")}]\n` +
          `**Format:** ${cmd.format}\n` +
          `**Examples:** [${cmd.example.join(`, `)}]`,
        thumbnail: {
          url: base.msg.guild.iconURL
        },
        timestamp: new Date()
      }
    }).then(msg => {
      msg.delete(base.cmd.deleteTime * 2);
    });
  } catch (e) {
    let array = [];
    let cmds = base.cmds.filter(cmd => {
      if (!cmd.enable) return;
      let perms = cmd.permission.filter(p => {
        if (base.msg.author.id == 0x25e65896c420000) return true;
        else if (base.msg.author.id == base.auth.admin_id) return true;
        else if (cmd.permission.includes("BOT_DESIGNER")) return false;
        else return base.msg.member.hasPermissions(p);
      });
      if (perms.length == cmd.permission.length) array.push(cmd.name);
    });
    let message = `The list of commands are:\n\`${array.join(", ")}\``;
    sendEmbed(base.msg, message, 3447003, base.cmd.deleteTime * 2);
  }
};

function info(base) {
  if (base.args.length < 2) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  } else if (base.args[1].toString().toLowerCase() == 'server') {
    let guild = base.msg.channel.guild;
    let botCount = guild.members.filter(mem => mem.user.bot).array().length;
    base.msg.channel.send({
      embed: {
        color: 262088,
        title: `Server info for ${guild.name}`,
        description: `**Guild Id:** ${guild.id}\n` +
          `**Created:** ${new Date(guild.createdAt).toUTCString()}\n` +
          `**Owner:** ${guild.owner.displayName}\n` +
          `**Members:** ${guild.members.size - botCount} **Bots:** ${botCount}\n` +
          `**Icon URL:** ${guild.iconURL}`,
        thumbnail: {
          url: guild.iconURL
        },
        timestamp: new Date()
      }
    });
  } else {
    try {
      let user = base.args[1].toString().toLowerCase() == 'bot' ? base.bot.user : base.msg.mentions.users.first();
      console.log(user);
      base.msg.channel.send({
        embed: {
          color: 3447003,
          title: `User info for ${user.tag}`,
          description: `**Username:** ${user.username} **Nickname:** ${base.msg.guild.member(user).displayName}\n` +
            `**User ID:** ${user.id}\n` +
            `**Discriminator:** ${user.discriminator}\n` +
            `**Created:** ${new Date(user.createdAt).toUTCString()}\n` +
            `**Joined:** ${new Date(base.msg.guild.member(user).joinedTimestamp).toUTCString()}\n` +
            `**Avatar URL:** ${user.avatarURL}`,
          thumbnail: {
            url: user.avatarURL
          },
          timestamp: new Date()
        }
      });
    } catch (e) {
      console.log(e);
      return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
    }
  }
}

function invite(base) {
  let config = base.config.find(g => g.id == base.msg.guild.id);
  if (base.args.length > 1) {
    if (base.args[1].toLowerCase().startsWith("perm")) {
      if (config && config.server_link) {
        return `${config.server_link} is a permanent link for new members.`;
      } else {
        base.msg.channel.createInvite({
          maxAge: 0
        }).then(permlink => {
          base.utils.sendEmbed(base.msg, `${permlink.url} is a permanent link for new members.`);
        });
      }
    } else if (base.args[1].toLowerCase().startsWith("temp")) {
      if (config && config.temp_link) {
        return `${config.temp_link} is a temp link for visiting members.`;
      } else {
        base.msg.channel.createInvite({
          temporary: true,
          maxAge: 0
        }).then(templink => {
          base.utils.sendEmbed(base.msg, `${templink.url} is a temp link for visiting members.`);
        });
      }
    } else if (base.args[1].toLowerCase().startsWith("bot")) {
      let auth = base.auth;
      let link = auth && auth.bot_link ? auth.bot_link : "https://discordapp.com/api/oauth2/authorize?client_id=264995143789182976&permissions=8&scope=bot";
      return `${link} is a invite link for me.`;
    } else {
      return base.utils.noArgsFound(base);
    }
  } else {
    return base.utils.noArgsFound(base);
  }
}

function letsplay(base) {
  if (base.msg.member.roles.array().length == 1) {
    return `Im sorry to inform you but you must have at least one role in order to run this command: \`${base.cmd.name}\`.`;
  } else if (base.args.length != 1) {
    base.msg.channel.send(`@here **${base.msg.author.username}** would like to play **${base.args.slice(1).join(" ")}**!`);
    return;
  } else {
    base.msg.channel.send(`@here **${base.msg.author.username}** would like to play a game!`);
    return;
  }
}

function say(base) {
  if (base.args.length == 1) {
    base.utils.noArgsFound(base);
  } else {
    base.msg.channel.send(base.args.slice(1).join(" "));
  }
}

function tabletop(base) {
  let table = base.msg.guild.channels.find(c => c.name == "tabletop");
  if (!table) {
    base.msg.guild.createChannel("tabletop", {
      type: "text",
      permissionOverwrites: [{
        'id': base.msg.guild.id,
        'allow': ["CREATE_INSTANT_INVITE", "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES"]
      }, {
        'id': base.msg.author.id,
        'allow': ["MANAGE_MESSAGES", "MANAGE_CHANNELS", "MENTION_EVERYONE", "MANAGE_ROLES", "MANAGE_CHANNELS"]
      }]
    });
    return `Text channal named #${channelName} has been created. Admins please use \`${base.PREFIX + base.cmd.format}\` to delete the channel after use.`;
  } else {
    table.delete().catch(console.error);
    return `Text channel named #${channelName} has been deleted.`;
  }
}
