exports.deleteAfterTime = (msg, timer, num) => {
  msg.channel.fetchMessages({limit: num}).then(msg => { // get the channel logs
    let msg_array = msg.array(); //create an array for messages
    msg_array.length = num;//limit to the requested number + 1 for the command message
    msg_array.map(m => m.delete(timer).catch(console.error));//has to delete messages individually.
  });
}

exports.getCommand = (cmds, cmdName) => {
  let commands = cmds.filter(cmd => {
    return cmd.alias.filter(p => p.trim().toLowerCase() == cmdName.trim().toLowerCase()).length > 0;
  });
  return commands[0];
}

exports.clean = (text) => {
  if (typeof(text) === "string") {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  } else {
    return text;
  }
}

exports.sendToModlog = (msg, message) => {
  msg.guild.channels.find(x => x.name == "mod_log")
    .send({
      embed: {
        color: 3447003,
        description: message
      }
    }).catch(console.error);
}

exports.sendEmbed = (msg, message) => {
  msg.channel.send({
      embed: {
        color: 3447003,
        description: message
      }
    }).catch(console.error);
}

exports.sendToOwner= (msg, message) => {
  msg.guild.owner.send({
      embed: {
        color: 3447003,
        description: message
      }
    }).catch(console.error);
}
