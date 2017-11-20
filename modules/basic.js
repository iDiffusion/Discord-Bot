


export function apply(msg, args){
  if(args.length < 2) return msg.channel.sendMessage("You did not define an argument. Usage: `?apply [role] [reason]`"); //check for role, reason
    else {
      msg.delete().catch(console.error); //delete message from chat
      let reasonFor = args.slice(1).join(" "); //set reason to arguments
      msg.guild.channels.find("name", "mod_log").sendEmbed({
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
