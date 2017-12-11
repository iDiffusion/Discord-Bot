var cmd, args;
var modRole, adminRole, staffRole;
var modlog, cmdchat;
const config = require("./config.json"); // import the config file

export function update(msg){
  cmd = msg.content.substr(1).split(" ")[0];
  args = msg.content.split(" ").slice(1);

  modlog = msg.guild.channels.find("name", "mod_log");
  cmdchat = msg.guild.channels.find("name", "commands");

  modRole = msg.guild.roles.find("name", "Mod"); //Assign Mod to modRole
  adminRole = msg.guild.roles.find("name", "Admin"); //Assign Admin to adminRole
  staffRole = msg.guild.roles.find("name", "Staff"); //Assign Staff to staffRole
}

export function apply(msg){
  msg.delete().catch(console.error); //delete message from chat
  if(args.length < 2) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}apply [role] [reason]\``); //check for role, reason
  }
  else if(!modlog) {
    msg.channel.sendmessage(`#mod_log does not exist please ask server owner to add this channel before using this function \`${PREFIX}apply\``);
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
