module.exports = function (base) {
  if(base.cmd.name == "blacklist") blacklist(base);
  else if(base.cmd.name == "broadcast") broadcase(base);
  else if(base.cmd.name == "ping") ping(base);
  else if(base.cmd.name == "restart") restart(base);
  else if(base.cmd.name == "set") set(base);
  else if(base.cmd.name == "shutdown") return shutdown(base);
  else if(base.cmd.name == "status") return status(base);
  else if(base.cmd.name == "whitelist") return whitelist(base);
}


exports.blacklist = (base) => {
  try {
    let user = base.msg.mentions.users.first();
    let args = base.args.map(a => a.toLowerCase());
    let remove = args.indexOf('-r') != -1;
    if (remove) {
      //TODO remove user from blacklist
      return `User has been removed from the blacklist.`;
    }
    let reason = base.args.slice(2).join(" ");
    //TODO add user to blacklist
    return `User has been added to the blacklist.`;
  } catch (e) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
};

exports.broadcast = (base) => {
  base.bot.guilds.map(g => {
    g.defaultChannel.send({
      embed: {
        color: 3447003,
        description: base.args.slice(1).join(" "),
        timestamp: new Date(),
        footer: {
          icon_url: base.msg.author.avatarURL,
          text: base.msg.author.tag
        }
      }
    });
  });
};

exports.ping = (base) => {
  msg.channel.sendMessage(`pong!\`${Math.floor(base.bot.ping)}ms\``);
};

exports.restart = (base) => {
  base.message.channel.send('Resetting...')
    .then(msg => base.bot.destroy())
    .then(() => base.bot.login(base.auth.token));
};

exports.set = (base) => {

};

exports.shutdown = (base) => {
  base.message.channel.send('Shutting Down...')
    .then(msg => base.bot.destroy());
};

exports.status = (base) => {

};

exports.whitelist = (base) => {
  try {
    let user = base.msg.mentions.users.first();
    let args = base.args.map(a => a.toLowerCase());
    let remove = args.indexOf('-r') != -1;
    if (remove) {
      //TODO remove user from whitelist
      return `User has been removed from the whitelist.`;
    }
    let reason = base.args.slice(2).join(" ");
    //TODO add user to whitelist
    return `User has been added to the whitelist.`;
  } catch (e) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
}
