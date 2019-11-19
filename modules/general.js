module.exports = function (base) {
  if(base.cmd.name == "apply") return apply(base);
  else if(base.cmd.name == "clean") return clean(base);
  else if(base.cmd.name == "donate") return donate(base);
  else if(base.cmd.name == "giveaway") return giveaway(base);
  else if(base.cmd.name == "help") return help(base);
  else if(base.cmd.name == "info") return info(base);
  else if(base.cmd.name == "invite") return invite(base);
  else if(base.cmd.name == "letsplay") return letsplay(base);
  else if(base.cmd.name == "say") return say(base);
  else if(base.cmd.name == "tabletop") return tabletop(base);
}

function apply (base) {
  let reasonFor = base.args.slice(2).join(" ");
  if (base.args.length <= 2) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  } else if (!base.msg.guild.roles.find(r => r.name.toLowerCase() == base.args[1].toLowerCase().replace(/@/g, ""))) {
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
      description: `${base.msg.author} has applied for the **${base.args[1]}** Role`,
      fields: [{
        name: 'Reason',
        value: reasonFor
      }],
      timestamp: new Date()
    }
  }).catch(console.error);
};

function clean (base) {
  base.msg.channel.fetchMessages().then(msgs => {
    let msg_array = message.array().filter(message => message.author.id == bot.id);
    msg_array.map(m => m.delete().catch(console.error));
  });
};

function donate (base) {
  return base.auth.donate_link ? base.auth.donate_link : "https://www.paypal.me/ikaikalee";
}

function giveaway (base) {
  //TODO change to message.createReactionCollector(filter, [option]);
  let message = base.msg.channel.fetchMessage(args[0]).catch(console.error);
  if (!message) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
  let users = [];
  let array = [];
  let reactions = message.reactions.array().map(r => r.users.array().map(u => {
    users.push(u);
    array.push(u.id);
  }));
  array = Array.from(new Set(array));
  if (base.debug) {
    console.log("This is the messsage: \n " + message.content);
    console.log(users);
  }
  return `${users.find(u => u.id == array.random())} you have won!`;
};

function help (base) {
  try {
    let cmd = base.cmds.find(c => c.name == args[1].toLowerCase());
    msg.send({
      embed: {
        color: 3447003,
        title: `Command: ${cmd.name}`,
        description: `Alias: ${cmd.alias.join(", ")}` +
          `Description: ${cmd.description}` +
          `Category: ${cmd.category}\n` +
          `Permission: ${cmd.permission.join(", ")}\n` +
          `Format: ${cmd.format}\n` +
          `Example: ${cmd.example}\n`,
        thumbnail: {
          url: guild.iconURL
        },
        timestamp: new Date()
      }
    });
  } catch (e) {
    let cmds = base.cmds.filter(c => {
      if (!c.enable) return false;
      let perms = c.permission.filter(p => base.msg.member.hasPermissions(p));
      return p.length == c.permission.length;
    });
    let array = [];
    cmds.map(c => array.push(c.name));
    return array.join(", ");
  }
};

function info (base) {
  if (base.args.length == 1) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  } else if (base.args[1].toString().toLowerCase() == 'server') {
    let guild = msg.channel.guild;
    let botCount = guild.members.filter(mem => mem.user.bot).length;
    if (isNaN(botCount)) botCount = 1;
    msg.channel.sendEmbed({
      color: 262088,
      title: `Server info for ${guild.name}`,
      description: `Guild Id: ${guild.id}\n` +
        `Created: ${new Date(guild.createdAt).toUTCString()}\n` +
        `Owner: ${guild.owner.displayName}\n` +
        `Members: ${guild.members.size - botCount}\tBots: ${botCount}\n` +
        `Icon URL: ${guild.iconURL}`,
      thumbnail: {
        url: guild.iconURL
      },
      timestamp: new Date()
    });
  } else {
    try {
      let user = args[1].toString().toLowerCase() == 'bot' ? base.bot.user : base.msg.mentions.users.first();
      base.msg.channel.send({
        embed: {
          color: 3447003,
          title: `User info for ${user.tag}`,
          description: `Username: ${user.username}\tNickname: ${base.msg.guild.member(user).nickname}\n` +
            `User ID: ${user.id}\n` +
            `Discriminator: ${user.discriminator}\n` +
            `Created: ${new Date(user.createdAt).toUTCString()}\n` +
            `Joined: ${new Data(msg.guild.member(user).joinedTimestamp).toUTCString()}\n` +
            `Avatar URL: ${user.avatarURL}`,
          thumbnail: {
            url: user.avatarURL
          },
          timestamp: new Date()
        }
      });
    } catch (e) {
      return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
    }
  }
}

function invite (base) {
  let config = base.config.find(g => g.id == base.msg.guild.id);
  if (base.args.length != 1) {
    if (base.args[1].toLowerCase().startsWith("perm")) {
      let link = config && config.server_link ? config.server_link : base.msg.channel.createInvite({
        maxAge: 0
      });
      return `${link} is a permanent link for new members.`;
    } else if (base.args[1].toLowerCase().startsWith("temp")) {
      let link = config && config.server_link ? config.server_link : base.msg.channel.createInvite({
        temporary: true,
        maxAge: 0
      });
      return `${link} is a temporary link for visiting members.`;
    } else if (base.args[1].toLowerCase().startsWith("bot")) {
      let auth = base.auth;
      let link = auth && auth.bot_link ? auth.bot_link : "https://discordapp.com/api/oauth2/authorize?client_id=264995143789182976&permissions=8&scope=bot";
      return `${link} is a invite link for me.`;
    }
  }
  return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
}

function letsplay (PREFIX, msg) {
  if (base.msg.member.roles.array().length == 1) {
    return `Im sorry to inform you but you must have at least one role in order to run this command: \`${base.cmd.name}\`.`;
  } else if (base.args.length != 1) {
    return base.msg.channel.send(`@here **${base.msg.author.username}** would like to play **${base.args.slice(1).join(" ")}**!`);
  } else {
    return base.msg.channel.send(`@here **${base.msg.author.username}** would like to play a game!`);
  }
}

function say (base) {
  if (base.args.length == 1) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  } else {
    base.msg.channel.send(base.args.slice(1).join(" "));
  }
}

function tabletop (base) {
  let channelName = base.cmd.name;
  let table = base.msg.guild.channels.find(c => c.name == channelName);
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
