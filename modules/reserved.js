"use strict";

module.exports = function(base) {
  if (base.cmd.name == "blacklist") return blacklist(base);
  else if (base.cmd.name == "broadcast") return broadcast(base);
  else if (base.cmd.name == "ping") return ping(base);
  else if (base.cmd.name == "restart") return restart(base);
  else if (base.cmd.name == "set") return set(base);
  else if (base.cmd.name == "shutdown") return shutdown(base);
  else if (base.cmd.name == "status") return status(base);
  else if (base.cmd.name == "whitelist") return whitelist(base);
}

function blacklist(base) {
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
    return base.utils.noArgsFound(base);
  }
};

function broadcast(base) {
  if (base.args.length == 1) return base.utils.noArgsFound(base);
  base.bot.guilds.map(guild => {
    let channel = guild.channels.find(x => x.name == "general");
    channel = channel ? channel : guild.channels.find(x => x.name == "mod_log");
    channel = channel ? channel : guild.channels[0];
    channel.send({
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

function ping(base) {
  return `pong!\`${Math.ceil(base.bot.ping)}ms\``;
};

function restart(base) {
  base.msg.channel.send({
      embed: {
        color: 3447003,
        description: 'Resetting...'
      }
    })
    .then(msg => base.bot.destroy())
    .then(() => base.bot.login(base.auth.token));
};

function set(base) {
  if (base.args.length == 1) return base.utils.noArgsFound(base);
  //TODO set attributes
};

function shutdown(base) {
  base.msg.channel.send({
      embed: {
        color: 3447003,
        description: 'Shutting Down...'
      }
    })
    .then(msg => base.bot.destroy());
};

function status(base) {
  //TODO send status message
};

function whitelist(base) {
  try {
    let user = base.msg.mentions.users.first();
    let remove = base.args.indexOf('-r') != -1;
    if (remove) {
      //TODO remove user from whitelist
      return `User has been removed from the whitelist.`;
    }
    let reason = base.args.slice(2).join(" ");
    //TODO add user to whitelist
    return `User has been added to the whitelist.`;
  } catch (e) {
    return base.utils.noArgsFound(base);
  }
}
