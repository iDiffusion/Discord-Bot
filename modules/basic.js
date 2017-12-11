exports.apply = (PREFIX, msg) => {
  msg.delete().catch(console.error); //delete message from chat
  if(args.length < 2) {
    return msg.channel.sendMessage("You did not define an argument. Usage: `?apply [role] [reason]`"); //check for role, reason
  }
  else if(!modlog) {
    msg.channel.sendmessage("#mod_log does not exist please ask server owner to add this channel before using this function `?apply`");
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
