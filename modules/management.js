export function ban(*****){
  if(!msg.member.roles.has(adminRole.id)) { //limit to admin only
          msg.guild.channels.find("name", "mod_log").sendMessage("**" + msg.author + "** has attempted to use the **ban** command in " + msg.channel + ":" + " `" + msg.content + "`"); //record message to modlog
          return msg.reply("You pleb, you don't have permission to use this command `?ban`."); //insult unauthorized user
        } else if(args.length < 2) msg.channel.sendMessage("You did not define an argument. Usage: `?ban [user] [reason]`"); //check for user, and reason
        try{
          msg.delete().catch(console.error); //delete message from chat
          userRemoved = msg.mentions.users.first();
          let userToBan = msg.mentions.users.first(); //set user to ban
          let banMsg = args.slice(1).join(" "); //set reason to arguments minus user
          msg.guild.member(userToBan).ban(); //ban the mentioned user
          msg.guild.members.get(userToBan.id).sendEmbed({
            color: 16721408,
            author: {
              name: msg.guild.name,
              icon_url: msg.guild.iconURL
            },
            title: 'Banned',
            description: `You have been banned!`,
            link: config.server_link,
            fields: [{
              name:'Reason',
              value: banMsg
            }],
            timestamp: new Date()
          });//send pm to user with reason
          msg.guild.channels.find("name", "mod_log").sendEmbed({
            color: 16721408,
            author: {
              name: userToBan.username,
              icon_url: userToBan.avatarURL
            },
            title: 'User Banned',
            description: `${msg.author} has been banned ${userToBan} `,
            fields: [{
              name:'Reason',
              value: banMsg
            }],
            timestamp: new Date()
          }); //send embed message to modlog
        } catch(e) {
          msg.reply("Please `@mention` a user to ban. " + args[0] + " is not a mention.");
          deleteAfterTime(msg, 2000, 2);
        }
}

export funtion kick(*******){
    if(!msg.member.roles.has(adminRole.id)) { //limit to admin only
      msg.guild.channels.find("name", "mod_log").sendMessage("**" + msg.author + "** has attempted to use the **kick** command in " + msg.channel + ":" + " `" + msg.content + "`"); //record message to modlog
      return msg.reply("You pleb, you don't have permission to use this command `?kick`."); //insult unauthorized user
    } else if(args.length < 2) msg.channel.sendMessage("You did not define an argument. Usage: `?kick [user] [reason]`"); //check for user, and reason
    try{
      msg.delete().catch(console.error); //delete message from chat
      userRemoved = msg.mentions.users.first();
      let userToKick = msg.mentions.users.first(); //set user to ban
      let kickMsg = args.slice(1).join(" "); //set reason to arguments minus user
      msg.guild.member(userToKick).kick(kickMsg); //kick the mentioned user
      msg.guild.members.get(userToKick.id).sendEmbed({
        color: 16733186,
        author: {
          name: msg.guild.name,
          icon_url: msg.guild.iconURL
        },
        title: 'Kicked',
        description: `You have been kicked!`,
        link: config.server_link,
        fields: [{
          name:'Reason',
          value: kickMsg
        }],
        timestamp: new Date()
      });//send pm to user with reason
      msg.guild.channels.find("name", "mod_log").sendEmbed({
        color: 16733186,
        author: {
          name: userToKick.username,
          icon_url: userToKick.avatarURL
        },
        title: 'User Kicked',
        description: `${msg.author} has kicked ${userToKick} `,
        fields: [{
          name:'Reason',
          value: kickMsg
        }],
        timestamp: new Date()
      }); //send embed message to modlog
    } catch(e) {
      msg.reply("Please `@mention` a user to kick. " + args[0] + " is not a mention.");
      deleteAfterTime(msg, 2000, 2);
    }
}

export function move(){
  if(!msg.member.roles.has(adminRole.id) && !msg.member.roles.has(modRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?move`."); //insult unauthorized user
    else if(args.length < 2) {
      msg.channel.sendMessage("You did not define enough arguments. Usage: `?move [VC from ID] [VC to ID]`"); //check for message to move
      return deleteAfterTime(msg, 2000, 2);
    } else if(isNaN(args[0]) || isNaN(args[1])){
      msg.channel.sendMessage("You did not define an argument. Usage: `?move [VC from ID] [VC to ID]`");
      return  deleteAfterTime(msg, 3000, 2);
    }
      let mem_array = msg.guild.channels.get(args[0]).members.array();
     if(mem_array.length < 1) {
      msg.channel.sendMessage(`Currently there are no members in ${msg.guild.channels.get(args[0]).name}. Please try again.`);
      return deleteAfterTime(msg, 2000, 2);
    }
    try {
      msg.delete();
      mem_array.map(id => msg.guild.member(id).setVoiceChannel(msg.guild.channels.get(args[1])));
    } catch (e){
      msg.channel.sendMessage("One of the provided channel ID's does not exist. Please make sure that the numbers provided are ID's");
      deleteAfterTime(msg, 3000, 1);
    }
}

export function prune(*****){
  var mdLimit;
  if(msg.member.roles.has(adminRole.id)) mdLimit = 100; //limit to admin only
  else if(msg.member.roles.has(modRole.id)) mdLimit = 20; //limit to mod only
  else return msg.reply("You pleb, you don't have permission to use this command `?purge | ?prune`."); //insult unauthorized user
  if(args.length === 0) return msg.channel.sendMessage("You did not define an argument. Usage: `?prune [number]`"); //check for message count
  if(isNaN(args[0])) return msg.channel.sendMessage(args[0] + " is not a number.")
  let messagecount = parseInt(args[0]); //fetch the number of messages to prune
  msg.channel.fetchMessages({limit: mdLimit}).then(msg => { // get the channel logs
    let msg_array = msg.array(); //create an array for messages
    msg_array.length = messagecount < mdLimit ? messagecount + 1: mdLimit;//limit to the requested number + 1 for the command message
    msg_array.map(m => m.delete().catch(console.error));//has to delete messages individually.
  });
  msg.channel.sendMessage(`${messagecount} messages have been deleted.`).catch(console.error);
  deleteAfterTime(msg, 2000, 1);
}

export function softban(*******){
  if(!msg.member.roles.has(adminRole.id)) { //limit to admin only
          msg.guild.channels.find("name", "mod_log").sendMessage("**" + msg.author + "** has attempted to use the **kick** command in " + msg.channel + ":" + " `" + msg.content + "`"); //record message to modlog
          return msg.reply("You pleb, you don't have permission to use this command `?kick`."); //insult unauthorized user
        } else if(args.length < 2) msg.channel.sendMessage("You did not define an argument. Usage: `?kick [user] [reason]`"); //check for user, and reason
        try{
          msg.delete().catch(console.error); //delete message from chat
          userRemoved = msg.mentions.users.first();
          let userToKick = msg.mentions.users.first(); //set user to ban
          let kickMsg = args.slice(1).join(" "); //set reason to arguments minus user
          msg.guild.member(userToKick).ban(); //ban the mentioned user
          msg.guild.unban(userToKick.id); //unban the mentioned user
          msg.guild.members.get(userToKick.id).sendEmbed({
            color: 16733186,
            author: {
              name: msg.guild.name,
              icon_url: msg.guild.iconURL
            },
            title: 'Kicked',
            description: `You have been kicked!`,
            link: config.server_link,
            fields: [{
              name:'Reason',
              value: kickMsg
            }],
            timestamp: new Date()
          });//send pm to user with reason
          msg.guild.channels.find("name", "mod_log").sendEmbed({
            color: 16733186,
            author: {
              name: userToKick.username,
              icon_url: userToKick.avatarURL
            },
            title: 'User Soft Banned',
            description: `${msg.author} has been soft banned ${userToKick} `,
            fields: [{
              name:'Reason',
              value: kickMsg
            }],
            timestamp: new Date()
          }); //send embed message to modlog
        } catch(e) {
          msg.reply("Please `@mention` a user to softban. " + args[0] + " is not a mention.");
          deleteAfterTime(msg, 2000, 2);
        }
}

export function warn(*****){
  if(!msg.member.roles.has(staffRole.id) && !msg.member.roles.has(modRole.id) && !msg.member.roles.has(adminRole.id)) { //limit to staff only
      msg.guild.channels.find("name", "mod_log").sendMessage("**" + msg.author + "** has attempted to use the **warn** command in " + msg.channel + ":" + " `" + msg.content + "`"); //record message to modlog
      return msg.reply("You pleb, you don't have permission to use this command `?warn`."); //insult unauthorized user
    } else if(args.length < 2) msg.channel.sendMessage("You did not define an argument. Usage: `?warn [user] [message]`"); //check for user, and reason
    try {
      msg.delete().catch(console.error); //delete message from chat
      let userToWarn = msg.mentions.users.first(); //set user to warn
      let warnMsg = args.slice(1).join(" "); //set reason to arguments minus user
      let highestRole = "Staff";
      console.log(userToWarn);
      if(msg.member.roles.has(adminRole.id)) highestRole = "Admin";
      else if(msg.member.roles.has(modRole.id)) highestRole = "Mod";
      else highestRole = "Staff";
      msg.guild.members.get(userToWarn.id).sendEmbed({
        color: 16774400,
        author: {
          name: msg.guild.name,
          icon_url: msg.guild.iconURL
        },
        title: 'Warning',
        description: `You have been warned by ${highestRole}`,
        fields: [{
          name:'Reason',
          value: warnMsg
        }],
        timestamp: new Date()
      }).catch(console.error); //send pm to user with reason
      msg.guild.channels.find("name", "mod_log").sendEmbed({
        color: 16774400,
        author: {
          name: userToWarn.username,
          icon_url: userToWarn.avatarURL
        },
        title: 'User Warned',
        description: `${msg.author} has warned ${userToWarn}`,
        fields: [{
          name:'Reason',
          value: warnMsg
        }],
        timestamp: new Date()
      }).catch(console.error); //send embed message to modlog
    } catch(e) {
      msg.channel.sendMessage("Please `@mention` a user to warn. " + args[0] + " is not a mention.");
      deleteAfterTime(msg, 2000, 2);
      console.log(e);
    }
}

