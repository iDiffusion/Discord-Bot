


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
 export function roles(msg, args){
 msg.channel.sendEmbed({
      color: 10826739,
      author: {
        name: msg.guild.name,
        icon_url: msg.guild.iconURL
      },
      title: 'Roles',
      description: "Below is a list of roles and a short description describing them.",
      fields: [{
        name:'Admin (Primary Role)',
        value:'administrator role, they are the owners and rulers of the server'
      },{
        name:'Mod (Primary Role)',
        value:'moderator role, they are here to help and have some power over the server and those in it'
      },{
        name:'Bot (Primary Role)',
        value:'role given to all bots that join/are invited to the server, allowing a clear separation from members'
      },{
        name:'Senior Member (Primary Role)',
        value:'role given to members who are actively participating in the server and have been so for an extended period of time, with a little more effort youll be a staff member in no time'
      },{
        name:'Member (Primary Role)',
        value:'basic role, but shows you are a regular on the server and community'
      },{
        name:'Staff (Secondary Role)',
        value:'pre-moderator role, they are here to help those new to the server and are given little power over the server to show that they are trustworthy'
      },{
        name:'Streamer (Secondary Role)',
        value:'streamer role, given to members who would like to stream on the channel with the highest quality of sound possible and permission to manage the members in that channel'
      },{
        name:'Streaming (Secondary Role)',
        value:'streamer friend role, given to individuals that are allowed to participate in streams giving them voice in the recording chats'
      },{
        name:'Bot Chief (Secondary Role)',
        value:'bot management role, allows you to use certain commands on the bots, like skipping songs without a vote or controlling the volume'
      }],
      timestamp: new Date()
    }).catch(console.error);
 }
