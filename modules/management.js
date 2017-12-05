var usersRemoved = [];
const config = require("/config/config.json"); // import the config file
const cmdChannelName = "commands";
#define PREFIX config.prefix

function sendToModlog(msg, type, color, user, message) {
	try {
		msg.guild.channels.find("name", "mod_log").sendEmbed({
			color: color,
			author: {
				name: user.username,
				icon_url: user.avatarURL
			},
			title: `User ${type.charAt(0).toUpperCase()}`,
			description: `${msg.author} has ${type.toLowerCase()} ${user}`,
			fields: [{
				name: `Reason`,
				value: message
			}],
			timestamp: new Date()
		});
		return 1;
	}
  catch(e) {
		return 0;
	}
}

function sendToDM(msg, type, color, user, message) {
	try {
		msg.guild.members.get(user.id).sendEmbed({
			color: color,
			author: {
				name: msg.guild.name,
				icon_url: msg.guild.iconURL
			},
			title: type.charAt(0).toUpperCase(),
			description: `You have been ${type.toLowerCase()} by ${msg.member.highestRole}`,
			fields: [{
				name:'Reason',
				value: message
			}],
			timestamp: new Date()
		});
		return 1;
	}
  catch(e) {
		return 0;
	}
}

function badUserToModlog(msg, func){
	try {
		msg.guild.channels.find("name", "mod_log").sendEmbed({
			color: 16718305,
			author: {
				name: msg.author.username,
				icon_url: msg.author.avatarURL
			},
			title: `Unauthorized user attempted to ${func} users`,
			description: `${msg.author} has used ${func} in #${msg.channel} text channel`,
			fields: [{
				name:'Command',
				value: `\`${msg.cleanContent}\``
			}],
			timestamp: new Date()
		});
    return 1;
	}
  catch(e) {
		return 0;
	}
}

export function ban(msg) {
  let args = msg.content.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", cmdChannelName);
  if(msg.channel.type == 'dm') { // Limit to guilds only
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  }
  else if(cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
  else if(!msg.member.hasPermission("banMembers")) { //limit to members that can ban in that quild
    badUserToModlog(msg, "ban");
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}ban\``); //insult unauthorized user
  }
  else if(args.length < 2 || !msg.mentions.users.first()) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}ban [user] [reason]\``); //check for user, and reason
  }
  msg.delete().catch(console.error); //delete message from chat
  let userToBan = msg.mentions.users.first(); //set user to ban
  let banMsg = args.join(" "); //set reason to arguments minus user
  if(sendToDM(msg, "banned", 16721408, userToBan, banMsg){
    msg.guild.member(userToBan).ban(banMsg); //ban the mentioned user
    usersRemoved.push(userToBan);
    if(!sendToModlog(msg, "banned", 16721408, userToBan, banMsg)) {
      msg.channel.sendMessage("Unable to find **#mod_log** text channel, please consult an admin or server owner.");
    }
  }
  else{
    msg.reply(`Please **@mention** a user to ban. **${args[0]}** is not a mention.`);
    deleteAfterTime(msg, 2000, 2);
  }
}

export function kick(msg) {
  let args = msg.content.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", cmdChannelName);
  if(msg.channel.type == 'dm') { // Limit to guilds only
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  }
  else if(cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
  else if(!msg.member.hasPermssion("kickMembers")) { //limit to memebrs that can kick in that quild
    badUserToModlog(msg, "kick");
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}kick\``); //insult unauthorized user
  }
  else if(args.length < 2) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}kick [user] [reason]\``); //check for user, and reason
  }
  msg.delete().catch(console.error); //delete message from chat
  let userToKick = msg.mentions.users.first(); //set user to ban
  let kickMsg = args.join(" "); //set reason to arguments minus user
  if(sendToDM(msg, "kicked", 16733186, userToKick, kickMsg)) {
    msg.guild.member(userToKick).kick(kickMsg); //kick the mentioned user
    usersRemoved.push(userToKick);
    if(!sendToModlog(msg, "kicked", 16733186, userToKick, kickMsg)) {
      msg.channel.sendMessage("Unable to find **#mod_log** text channel, please consult an admin or server owner.")
    }
  }
  else {
    msg.reply(`Please **@mention** a user to kick. **${args[0]}** is not a mention.`);
    deleteAfterTime(msg, 2000, 2);
  }
}

export function move(msg){
  if(!msg.member.hasPermission("voiceMoveMembers")) {
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}move `); //insult unauthorized user
  }
  else if(args.length < 2 || isNaN(args[0]) || isNaN(args[1])) {
    msg.channel.sendMessage(`You did not define enough arguments. Usage: \`${PREFIX}move [VC from ID] [VC to ID]`); //check for message to move
    return deleteAfterTime(msg, 2000, 2);
  }
  let mem_array = msg.guild.channels.get(args[0]).members.array();
  let fromChannel = msg.guild.channels.get(args[0]);
  let toChannel = msg.guild.channels.get(args[1]);
  if(mem_array.length == 0 && fromChannel) {
    msg.channel.sendMessage(`Currently there are no members in ${fromChannel.name}. Usage: \`${PREFIX}move [VC from ID] [VC to ID]\``);
    return deleteAfterTime(msg, 2000, 2);
  }
  else if(!fromChannel || fromChannel.type != "text") {
    msg.channel.sendMessage("From channel ID doesnt match a text channel from this server. Please try again.");
    return deleteAfterTime(msg, 2000, 2);
  }
  else if(!toChannel || toChannel.type != "text"){
    msg.channel.sendMessage("To channel ID doesnt match a text channel from this server. Please try again.");
    return delteAfterTime(msg, 2000, 2);
  }
  try {
    msg.delete();
    mem_array.map(id => msg.guild.member(id).setVoiceChannel(msg.guild.channels.get(args[1])));
  } catch (e){
    msg.channel.sendMessage("One of the provided channel ID's does not exist. Please make sure that the numbers provided are ID's");
    deleteAfterTime(msg, 3000, 1);
  }
}

/*
export function prune(msg){
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
*/

export function softban(msg){
  let args = msg.content.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", cmdChannelName);
  if(msg.channel.type == 'dm') { // Limit to guilds only
    return msg.channel.sendMessage("`Unable to use this command in private chat.``");
  }
  else if(cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
  else if(!msg.member.hasPermission("banMembers") || !msg.member.hasPermssion("kickMembers")) { //limit to admin only
    badUserToModlog(msg, "softban");
    return msg.reply(`You pleb, you don't have permission to use this command \`${PREFIX}softban\``); //insult unauthorized user
  }
  else if(args.length < 2 || !msg.mentions.users.first()) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}softban [user] [reason]\``); //check for user, and reason
  }
    msg.delete().catch(console.error); //delete message from chat
    let userToKick = msg.mentions.users.first(); //set user to ban
    let kickMsg = args.join(" "); //set reason to arguments minus user
  if(sendToDM(msg, "Soft Banned", 16733186, userToKick, kickMsg)) {
    msg.guild.ban(userToKick.id, kickMsg); //ban the mentioned user
    msg.guild.unban(userToKick.id, "Soft Ban Only"); //unban the mentioned user
    usersRemoved.push(userToKick);
    if(!sendToModlog(msg, "Soft Banned", 16733186, userToKick, kickMsg)) {
      msg.channel.sendMessage("Unable to find #mod_log text channel, please consult an admin or server owner.");
    }
  }
  else {
    msg.channel.sendMessage(`Please **@mention** a user to kick. **${args[0]}** is not a mention.`);
    deleteAfterTime(msg, 2000, 2);
  }
}

export function warn(msg){
  let args = msg.content.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", "commands");
  if(msg.channel.type == 'dm'){
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  }
  else if(cmdChat && msg.channel.name != "commands") {
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
  else if(!msg.member.hasPermission("muteMembers") && !msg.member.hasPermission("deafenMembers")) { //limit to members that can ban in that quild
    badUserToModlog(msg, "Warn");
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}warn\``); //insult unauthorized user
  }
  else if(args.length < 2) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}warn [user] [reason]\``); //check for user, and reason
  }
  msg.delete().catch(console.error); //delete message from chat
  let userToWarn = msg.mentions.users.first(); //set user to warn
  let warnMsg = args.slice(1).join(" "); //set reason to arguments minus user
  if(sendToDM(msg, "Warned", 16774400, userToWarn, warnMsg)) {
    if(!sendToModlog(msg, "Warned", 16774400, userToWarn, warnMsg)) {
      msg.channel.sendMessage("Unable to find **#mod_log** text channel, please consult an admin or server owner.")
    }
  }
  else{
    msg.channel.sendMessage(`Please **@mention** a user to kick. **${args[0]}** is not a mention.`);
    deleteAfterTime(msg, 2000, 2);
    console.log(e);
  }
}

export function purge(msg){
  let args = msg.content.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", cmdChannelName);
  if(msg.channel.type == "dm") {
    return msg.reply("Unable to use this command in private chat.");
  }
  else if(cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
	else if(!msg.member.hasPermission("kickMembers")) { //limit to admin only
		badUserToModlog(msg, "prune");
		return msg.reply("You pleb, you don't have permission to use this command `?purge`."); //insult unauthorized user
	}
	else if(args.length < 1) msg.channel.sendMessage("You did not define an argument. Usage: `?purge [days]`"); //check for user, and reason
	try{
		msg.guild.pruneMembers(arg[0],false,"Removed for inactivity.").then(pruned =>{
      if(modlog) {
        modlog.sendMessage(`I just pruned ${pruned} members!`);
      }
      else {
        msg.channel.sendMessage(`I just pruned ${pruned} members!`);
      }
    });
	} catch(e) {
		msg.channel.sendMessage("You did not define an argument. Usage: `?purge [days]`");
		deleteAfterTime(msg, 2000, 2);
		console.error(e);
	}
}

//-----------------------------------| Member Events |---------------------------------------\\
export function memberAdd(mem){//New member joined
  if(config.welcome_pm){
    let msgToSend = config.welcome_pm.replace(/$server/gi, mem.guild.name).replace(/$user/gi, mem.user). replace(/$mention/gi, mem.user.username);
    msgToSend = msgToSend.split(" ").map(word => {
      if(word.startsWith("#")){
        let channel = mem.guild.channels.find("name", word.substr(1));
        word = channel ? channel : word;
      }
    });
    mem.user.sendMessage(msgToSend);
  }
  if(config.welcome_msg){
    let msgToSend = config.welcome_msg.replace(/$server/gi, mem.guild.name).replace(/$user/gi, mem.user). replace(/$mention/gi, mem.user.username);
    mem.guild.channels.find("name", "general").sendMessage(msgToSend);
  }
  var modlog = mem.guild.channels.find("name"."mod_log");
  if(!modlog)
    modlog = mem.guild.defaultChannel;
  }
  modlog.sendEmbed({
    color: 3276547,
    author: {
      name: mem.displayName + "#" + mem.user.discriminator,
      icon_url: user.user.avatarURL
    },
    title: `${mem.user.toString()} | User Joined`,
    description: `User: ${mem.user} joined the server`,
    timestamp: new Date()
  });
}

export function memberLeave(mem){ //Member leaves/kicked
  usersRemoved.map(user =>{
    if(user.id == mem.id){
      let index = usersRemoved.indexOf(mem);
      usersRemoved.splice(index, 1);
      return;
    }
  })
  var modlog = mem.guild.channels.find("name"."mod_log");
  if(!modlog)
    modlog = mem.guild.defaultChannel;
  }
  modlog.sendEmbed({
    color: 285951,
    author: {
      name: mem.displayName + "#" + mem.user.discriminator,
      icon_url: mem.user.avatarURL
    },
    title: `${mem.user.toString()} | User Left`,
    description: `User: ${mem.user} left the server`,
    timestamp: new Date()
  });
}//End member mod_log

export function memberBan(mem){ //Member Ban
  usersRemoved.map(user =>{
    if(user.id == mem.id){
      let index = usersRemoved.indexOf(mem);
      usersRemoved.splice(index, 1);
      return;
    }
  })
  var modlog = mem.guild.channels.find("name"."mod_log");
  if(!modlog)
    modlog = mem.guild.defaultChannel;
  }
  modlog.sendEmbed({
      color: 6546816,
      author: {
        name: mem.displayName + "#" + mem.user.discriminator,
        icon_url: user.user.avatarURL
      },
      title: `${mem.id.toString()} | User Banned`,
      description: `User: ${mem.user} was banned`,
      timestamp: new Date()
    });
  }catch(e){
    console.log(e);
  }
}
