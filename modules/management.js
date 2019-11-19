const cmdChannelName = "commands";

function deleteAfterTime(msg, timer, num){
  msg.channel.fetchMessages({limit: num}).then(msg => { // get the channel logs
    let msg_array = msg.array(); //create an array for messages
    msg_array.length = num;//limit to the requested number + 1 for the command message
    msg_array.map(m => m.delete(timer).catch(console.error));//has to delete messages individually.
  });
}

function sendToModlog(msg, type, color, user, message) {
	try {
		msg.guild.channels.find("name", "mod_log").sendEmbed({
			color: color,
			author: {
				name: user.username,
				icon_url: user.avatarURL
			},
			title: `User ${type.charAt(0).toUpperCase() + type.slice(1)}`,
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
			title: type.charAt(0).toUpperCase() + type.slice(1),
			description: `You have been ${type.toLowerCase()} by an Admin`,
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



exports.banMembers = (PREFIX, msg, bot, usersRemoved) => {
  let args = msg.cleanContent.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdChat = msg.guild.channels.find("name", cmdChannelName);
  if(msg.channel.type == 'dm') { // Limit to guilds only
    msg.channel.sendMessage("Unable to use this command in private chat.");
  }
	else if(!msg.guild.member(bot.user).hasPermission("BAN_MEMBERS")){ // check if bot has permission
		msg.channel.sendMessage("Unable to complete request to ban members, I don't have the necessary permissions: `BAN_MEMBERS`\n An admin or server owner must change this before you are able to use this command.");
	}
  else if(cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat
    msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
  else if(!msg.member.hasPermission("BAN_MEMBERS")) { //limit to members that can ban in that guild
    badUserToModlog(msg, "ban");
    msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}ban\``);
  }
  else if(args.length < 2 || !msg.mentions.users.first()) { //check for all fields
    msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}ban [user] [reason]\``);
  }
  else {
    msg.delete().catch(console.error);
    let userToBan = msg.mentions.users.first();
    let banMsg = args.join(" ");
    if(sendToDM(msg, "banned", 16721408, userToBan, banMsg)){ // check if user exist
      msg.guild.member(userToBan).ban(banMsg);
      usersRemoved.push(userToBan);
      if(!sendToModlog(msg, "banned", 16721408, userToBan, banMsg)) {
        msg.channel.sendMessage("Unable to find **#mod_log** text channel, please consult an admin or server owner.");
      }
    }
    else{
      msg.channel.sendMessage(`Please **@mention** a user to ban. **${args[0]}** is not a mention.`);
      deleteAfterTime(msg, 2000, 1);
    }
  }
  return usersRemoved;
}

exports.react = (PREFIX, msg, bot) => {
  let args = msg.content.split(" ").slice(1)
	if(!msg.guild.member(bot.user).hasPermission("MANAGE_ROLES")){ // check if bot has permission
		msg.channel.sendMessage("Unable to complete request to manage members, I don't have the necessary permissions: `MANAGE_ROLES`\n An admin or server owner must change this before you are able to use this command.");
	}
  else if(!msg.member.hasPermission("MANAGE_ROLES")) { //limit to members that can give roles in that guild
    badUserToModlog(msg, "react");
    msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}react\``);
  }
  else if(args.length < 2) { //check for all fields
    msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}react [message id] [role]\``);
  }
  else {
    msg.delete().catch(console.error);
    let channel = msg.channel;
		let role = msg.mentions.roles.first();
		try{
			addRoleToUser(msg, bot, role, args);
		}
    catch (e) {
			msg.channel.send(`You did not define an argument. Usage: \`${PREFIX}react [message id] [role]\``);
      msg.channel.send(`Please make sure the proper message id is given and **@mention** a role to add. **${args[1]}** is not a mention.`);
      deleteAfterTime(msg, 2000, 2);
    }
  }
}

async function addRoleToUser(msg, bot, role, args){
	await  bot.channels.find("id",msg.channel.id).fetchMessages({around: args[0].trim(), limit: 1})
	.then(async messages => {
		let fetchedMsg = messages.first();
		fetchedMsg.reactions.forEach(async (reaction) => {
			let usersWhoReacted = await reaction.fetchUsers();
			usersWhoReacted.forEach(async (user) => {
				msg.guild.fetchMember(user).then(mem => {
					mem.addRole(role);
					console.log(mem.displayName);
				}).catch();
			});
		});
	});
}

exports.purge = (PREFIX, msg, bot) => {
  let args = msg.content.trim().split(/ +/g).slice(1);
  let mdLimit = 25;
  if(msg.channel.tpye == "dm"){
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  }
  else if(!msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){
    return msg.channel.sendMessage("Unable to complete request to prune messages, I don't have the necessary permissions: `MANAGE_MESSAGES`\n An admin or server owner must change this before you are able to use this command.");
  }
  else if(!msg.member.hasPermission("MANAGE_MESSAGES")){
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}purge\``);
  }
  else if(args.length === 0) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}prune [number]\``);
  }
  else if(isNaN(args[0])) {
    return msg.channel.sendMessage(args[0] + " is not a number.");
  }
  else {
    try{
    let messagecount = parseInt(args[0]).catch(console.error); //fetch the number of messages to prune
    deleteAfterTime(msg, 0, messagecount + 1);
    msg.channel.sendMessage(`${messagecount} messages have been deleted.`).catch(console.error);
    deleteAfterTime(msg, 2000, 1);
  }
    catch(err){}
  }
}

exports.kickMembers = (PREFIX, msg, bot, usersRemoved) => {
  let args = msg.cleanContent.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdChat = msg.guild.channels.find("name", cmdChannelName);
  if(msg.channel.type == 'dm') { // Limit to guilds only
    msg.channel.sendMessage("Unable to use this command in private chat.");
  }
	else if(!msg.guild.member(bot.user).hasPermission("KICK_MEMBERS")){ // check if bot has permission
		msg.channel.sendMessage("Unable to complete request to kick members, I don't have the necessary permissions: `KICK_MEMBERS`\n An admin or server owner must change this before you are able to use this command.");
	}
  else if(cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat
    msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
  else if(!msg.member.hasPermission("KICK_MEMBERS")) { //limit to members that can kick in that guild
    badUserToModlog(msg, "kick");
    msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}kick\``);
  }
  else if(args.length < 2 || !msg.mentions.users.first()) { //check for all fields
    msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}kick [user] [reason]\``);
  }
  else {
    msg.delete().catch(console.error);
    let userToKick = msg.mentions.users.first();
    let kickMsg = args.join(" ");
    if(sendToDM(msg, "kicked", 16733186, userToKick, kickMsg)) { //check if user exist
      msg.guild.member(userToKick).kick(kickMsg);
      usersRemoved.push(userToKick);
      if(!sendToModlog(msg, "kicked", 16733186, userToKick, kickMsg)) {
        msg.channel.sendMessage("Unable to find **#mod_log** text channel, please consult an admin or server owner.");
      }
    }
    else {
      msg.channel.sendMessage(`Please **@mention** a user to kick. **${args[0]}** is not a mention.`);
      deleteAfterTime(msg, 2000, 1);
    }
  }
  return usersRemoved;
}

exports.moveMembers = (PREFIX, msg, bot) => {
	if(msg.channel.type == 'dm') { // Limit to guilds only
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  }
	else if(!msg.guild.member(bot.user).hasPermssion("MOVE_MEMBERS")){ //check if bot has permission to move members
		return msg.channel.sendMessage("Unable to complete request to move members, I don't have the necessary permissions `MOVE_MEMBERS`\n An admin or server owner must change this before you are able to user this command.`");
	}
  if(!msg.member.hasPermission("MOVE_MEMBERS")) { //limit to members taht have permission
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}move `);
  }
  else if(args.length < 2 || isNaN(args[0]) || isNaN(args[1])) { //check for all fields
    msg.channel.sendMessage(`You did not define enough arguments. Usage: \`${PREFIX}move [VC from ID] [VC to ID]`);
    return deleteAfterTime(msg, 2000, 2);
  }
  let mem_array = msg.guild.channels.get(args[0]).members.array();
  let fromChannel = msg.guild.channels.get(args[0]);
  let toChannel = msg.guild.channels.get(args[1]);
  if(mem_array.length == 0 && fromChannel) { //check that members are in from channel
    msg.channel.sendMessage(`Currently there are no members in ${fromChannel.name}. Usage: \`${PREFIX}move [VC from ID] [VC to ID]\``);
    return deleteAfterTime(msg, 2000, 2);
  }
  else if(!fromChannel || fromChannel.type != "text") { //check that from channel exist
    msg.channel.sendMessage("From channel ID doesnt match a text channel from this server. Please try again.");
    return deleteAfterTime(msg, 2000, 2);
  }
  else if(!toChannel || toChannel.type != "text"){ //check taht to channel exist
    msg.channel.sendMessage("To channel ID doesnt match a text channel from this server. Please try again.");
    return delteAfterTime(msg, 2000, 2);
  }
  try {
    msg.delete().catch(console.error);
    mem_array.map(id => msg.guild.member(id).setVoiceChannel(msg.guild.channels.get(args[1])));
  } catch (e){
    msg.channel.sendMessage("One of the provided channel ID's does not exist. Please make sure that the numbers provided are ID's");
    deleteAfterTime(msg, 3000, 1);
  }
}

exports.softbanMembers = (PREFIX, msg, bot, usersRemoved) => {
  let args = msg.cleanContent.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdChat = msg.guild.channels.find("name", cmdChannelName);
  if(msg.channel.type == 'dm') { // Limit to guilds only
    msg.channel.sendMessage("`Unable to use this command in private chat.``");
  }
	else if(!msg.guild.member(bot.user).hasPermssion("BAN_MEMBERS")){ //check if bot has permission to ban members
		msg.channel.sendMessage("Unable to complete request to move members, I don't have the necessary permissions `BAN_MEMBERS`\n An admin or server owner must change this before you are able to user this command.`");
	}
  else if(cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat if exist
    msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
  else if(!msg.member.hasPermission("BAN_MEMBERS") || !msg.member.hasPermssion("KICK_MEMBERS")) { //limit to members with persmission
    badUserToModlog(msg, "softban");
    msg.reply(`You pleb, you don't have permission to use this command \`${PREFIX}softban\``);
  }
  else if(args.length < 2 || !msg.mentions.users.first()) {//check for all fiewls
    msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}softban [user] [reason]\``);
  }
  else {
    msg.delete().catch(console.error);
    let userToKick = msg.mentions.users.first();
    let kickMsg = args.join(" ");
    if(sendToDM(msg, "Soft Banned", 16733186, userToKick, kickMsg)) { //check if user exist
      msg.guild.ban(userToKick.id, kickMsg);
      msg.guild.unban(userToKick.id, "Soft Ban Only");
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
  return usersRemoved;
}

exports.warnMembers = (PREFIX, msg) => {
  let args = msg.cleanContent.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", "commands");
  if(msg.channel.type == 'dm'){ //limit to guilds only
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  }
  else if(cmdChat && msg.channel.name != "commands") { //limit to command chat if exist
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
  else if(!msg.member.hasPermission("MUTE_MEMBERS") && !msg.member.hasPermission("DEAFEN_MEMBERS")) { //limit to memebrs that can mute or deafen members
    badUserToModlog(msg, "Warn");
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}warn\``);
  }
  else if(args.length < 2) { //check for all fields
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}warn [user] [reason]\``);
  }
  msg.delete().catch(console.error);
  let userToWarn = msg.mentions.users.first();
  let warnMsg = args.slice(1).join(" ");
  if(sendToDM(msg, "Warned", 16774400, userToWarn, warnMsg)) { // check if user exist
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

exports.prune = (PREFIX, msg, bot) => {
  return;
  let args = msg.content.split(" ").slice(1);
  let modlog = msg.guild.channels.find("name", "mod_log");
  let cmdchat = msg.guild.channels.find("name", cmdChannelName);
  if(msg.channel.type == "dm") { //limit to guilds only
    return msg.reply("Unable to use this command in private chat.");
  }
	else if(!msg.guild.member(bot.user).hasPermssion("KICK_MEMBERS")){ //check if bot has permission to kick members
		return msg.channel.sendMessage("Unable to complete request to move members, I don't have the necessary permissions `KICK_MEMBERS`\n An admin or server owner must change this before you are able to user this command.`");
	}
  else if(cmdChat && msg.channel.name != cmdChannelName) { //limit to command chat
    return msg.channel.sendMessage(`Please use **${cmdChat.toString()}** chat to use bot commands.`);
  }
	else if(!msg.member.hasPermission("KICK_MEMBERS")) { //limit to members that can kick memebrs
		badUserToModlog(msg, "prune");
		return msg.reply(`You pleb, you don't have permission to use this command \`${PREFIX}prune\`.`);
	}
	else if(args.length != 1 || isNan(args[0])) { //check for all fields
		msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}prune [days]\``);
	}
	try { //check if args[0] is a number
		msg.guild.pruneMembers(arg[0],false,"Removed for inactivity").then(pruned =>{
      if(modlog) {
        modlog.sendMessage(`I just pruned ${pruned} members!`);
      }
      else {
        msg.channel.sendMessage(`I just pruned ${pruned} members!`);
      }
    });
	}
	catch(e) {
		msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}prune [days]\``);
		deleteAfterTime(msg, 2000, 2);
		console.error(e);
	}
}

//-----------------------------------| Member Events |---------------------------------------
exports.memberAdded = (mem, guild, config) => {//New member joined
  if(config.welcome_pm){
    let msgToSend = config.welcome_pm.replace(/$server/gi, mem.guild.name).replace(/$user/gi, mem.user).replace(/$mention/gi, mem.user.username);
    msgToSend = msgToSend.split(" ").map(word => {
      if(word.startsWith("#")){
        let channel = mem.guild.channels.find("name", word.substr(1));
        word = channel ? channel : word;
      }
    });
    mem.user.sendMessage(msgToSend);
  }
  if(config.welcome_msg) {
    let msgToSend = config.welcome_msg.replace(/$server/gi, mem.guild.name).replace(/$user/gi, mem.user).replace(/$mention/gi, mem.user.username);
    mem.guild.channels.find("name", "general").sendMessage(msgToSend);
  }
  var modlog = mem.guild.channels.find("name","mod_log");
  if(!modlog){
    modlog = mem.guild.defaultChannel;
  }
  modlog.sendEmbed({
    color: 3276547,
    author: {
      name: mem.displayName + "#" + mem.user.discriminator,
      icon_url: mem.user.avatarURL
    },
    title: `${mem.user.toString()} | User Joined`,
    description: `User: ${mem.user} joined the server`,
    timestamp: new Date()
  });
}

exports.memberRemoved = (mem, guild, usersRemoved) => { //Member leaves/kicked
  let length = usersRemoved.length;
  usersRemoved = usersRemoved.filter(member => usersRemoved.indexOf(mem) == -1);
  if(usersRemoved.length != length) {
    return usersRemoved;
  }
  var modlog = mem.guild.channels.find("name","mod_log");
  if(!modlog){
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
  return usersRemoved;
}//End member mod_log

exports.memberBanned = (mem, guild, usersRemoved) => { //Member Ban
  let length = usersRemoved.length;
  usersRemoved = usersRemoved.filter(member => userRemoved.indexOf(mem) == -1);
  if(usersRemoved.length != length) {
    return usersRemoved;
  }
  var modlog = mem.guild.channels.find("name","mod_log");
  if(!modlog) {
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
}

exports.memberUpdated = (newMem, oldMem) => {
  return;
}
