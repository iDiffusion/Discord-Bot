exports.apply = (base) => {
  let reasonFor = base.args.slice(2).join(" ");
  if (base.args.length <= 2) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  } else if (base.msg.guild.roles.find(r => r.name == args[1].toLowerCase()).length != 0) {
    return `Im sorry to inform you but you must have at least one role in order to run this command: \`${base.cmd.name}\`.`;
  }
  base.msg.guild.channels.find(c => c.name == "mod_log");.send({
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

exports.broadcast = (base) => {

};

exports.clean = (base) => {
  base.msg.channel.fetchMessages().then(msgs => {
    let msg_array = message.array().filter(message => message.id == bot.id);
    msg_array.map(m => m.delete().catch(console.error));
  });
};

exports.giveaway = (base) => {
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
  if(base.debug){
    console.log("This is the messsage: \n " + message.content);
    console.log(users);
  }
  return `${users.find(u => u.id == array.random())} you have won!`;
};

exports.help = (base) => {
  let cmd = undefined;
  if (base.args.length == 1 || (cmd = base.cmds.find(c => c.name == args[1].toLowerCase()))) {
    let cmds = base.cmds.filter(c => base.msg.member.hasPermissions(c.permision));
    let array = [];
    cmds.map(c => array.push(c.name));
    return array.join(", ");
  }
  msg.send({
    embed: {
      color: 3447003,
      title: `Command: ${cmd.name}`,
      description:
      `Alias: ${cmd.alias.join(", ")}` +
      `Description: ${cmd.description}` +
      `Category: ${cmd.category}\n` +
      `Permission: ${cmd.permission.join(", ")}\n` +
      `Format: ${cmd.format}\n` +
      `Example: ${cmd.example}\n`,
      thumbnail: {url: guild.iconURL},
      timestamp: new Date()
    }
  });
};

exports.info = (base) => {
  if (args.length == 1) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  } else if (args[1].toString().toLowerCase() == 'server') {
    let guild = msg.channel.guild;
    let botCount = guild.members.filter(mem => mem.user.bot).length;
    if (isNaN(botCount)) botCount = 1;
    msg.channel.sendEmbed({
      color: 262088,
      title: `Server info for ${msg.guild.name}`,
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
      let user = args[1].toString().toLowerCase() == 'bot' ? bot.user : msg.mentions.users.first();
      msg.channel.sendEmbed({
        color: 3447003,
        title: `User info for ${user.username}`,
        description: `Username: ${user.username}   Nickname: ${msg.guild.member(user).nickname}\n` +
          `User ID: ${user.id}\n` +
          `Discriminator: ${user.discriminator}\n` +
          `Created: ${new Date(user.createdAt).toUTCString()}\n` +
          `Joined: ${new Data(msg.guild.member(user).joinedTimestamp).toUTCString()}\n` +
          `Avatar URL: ${user.avatarURL}`,
        thumbnail: {
          url: user.avatarURL
        },
        timestamp: new Date()
      });
    } catch (e) {
      msg.reply("Please `@mention` a user to see that users information. " + args[0] + " is not a mention.");
      deleteAfterTime(msg, 3000, 2);
    }
  }
}

exports.invite = (base) => {
  let config = base.config.find(g => g.id == base.msg.guild.id);
  if (base.args.length != 1) {
    if (base.args[1].toLowerCase().startsWith("perm")) {
      let link = config && config.server_link ? config.server_link: base.msg.channel.createInvite({maxAge: 0});
      return `${link} is a permanent link for new members.`;
    } else if (base.args[1].toLowerCase().startsWith("temp")) {
      let link = config && config.server_link ? config.server_link: base.msg.channel.createInvite({temporary: true, maxAge: 0});
      return `${link} is a temporary link for visiting members.`;
    } else if (base.args[1].toLowerCase().startsWith("bot")) {
      return `${auth.bot_link} is a invite limk for me.`;
    }
  }
  return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
}

exports.say = (base) => {
  if(args.length == 1) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  } else {
    msg.channel.send(args.join(" "));
  }
}

exports.tabletop = (base) => {
  let channelName = base.cmd.name;
  let table = base.msg.guild.channels.find(c => c.name == channelName);
  if(!table) {
    msg.guild.createChannel("tabletop", "text", [
      {'id': base.msg.guild.id, 'type': 'role', 'deny': 805449744, 'allow': 379969},
      {'id': base.msg.author.id, 'type': 'member', 'deny': 536875024, 'allow': 268954689}]);
    return `Text channal named #${channelName} has been created. Admins please use \`${base.PREFIX + base.cmd.format}\` to delete the channel after use.`);
  } else {
    table.delete().catch(console.error);
    return `Text channel named #${channelName} has been deleted.`);
  }
}
