exports.apply = (PREFIX, msg) => {
  msg.delete().catch(console.error); //delete message from chat
  let args = msg.content.trim().split(/ +/g).slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let reasonFor = args.slice(1).join(" ");
  if(args.length < 2) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}apply [role] [reason]\``); //check for role, reason
  }
  else if(!modlog) {
    msg.channel.sendMessage("Unable to find **#mod_log** text channel, please consult an admin or server owner.");
   }
  else {
    modlog.sendEmbed({
      color: 7013119,
      author: {
        name: msg.author.username,
        icon_url: msg.author.avatarURL
      },
      title: 'Role Application',
      description: `${msg.author} has applied for the **${args[0]}** Role`,
      fields: [{
        name:'Reason',
        value: reasonFor
      }],
      timestamp: new Date()
    }); //send embedded message
  }
}

exports.giveaway = (PREFIX, msg) => {
  return msg.channel.sendMessages(`This command is currently unavaiiable, if you wish to know when this command will be implemented feel free to message me.`);
}
