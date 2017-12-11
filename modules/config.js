var cmd, args;
var chiefRole, modRole, adminRole, staffRole, seniorRole;
var modlog, cmdchat;
const config = require("./config.json"); // import the config file

export function update(msg){
  cmd = msg.content.substr(1).split(" ")[0];
  args = msg.content.split(" ").slice(1);

  modlog = msg.guild.channels.find("name", "mod_log");
  cmdchat = msg.guild.channels.find("name", "commands");

  chiefRole = msg.guild.roles.find("name","Bot Chief"); //Assign Bot Chief to chiefRole
  modRole = msg.guild.roles.find("name", "Mod"); //Assign Mod to modRole
  adminRole = msg.guild.roles.find("name", "Admin"); //Assign Admin to adminRole
  staffRole = msg.guild.roles.find("name", "Staff"); //Assign Staff to staffRole
  seniorRole = msg.guild.roles.find("name", "Senior Member"); //Assign SeniorMember to seniorRole
}

export function setGame(msg, args) {
	if(!msg.user.hasRole(adminRole)) {
		return msg.reply("You pleb, you don't have permission to use this command `${config.prefix}setGame`."); //insult unauthorized user
	}
	else if(args.length < 1) {
		msg.channel.sendMessage("You did not define an argument. Usage: `${config.prefix}setGame [game]`"); //check for game
		return deleteAfterTime(msg, 5000, 2);
	}
	try{
		msg.channel.sendMessage("Game is being set, please wait ...");
		bot.user.setGame(args.join(" "));
	}
	catch(e){
		msg.channel.sendMessage(`${e}`);
		console.log(e);
	}
	deleteAfterTime(msg, 5000, 2);
}

export function setPrefix(msg, args){
	if(!msg.user.hasRole(adminRole)) {
		return msg.reply("You pleb, you don't have permission to use this command `${config.prefix}setPrefix`."); //insult unauthorized user
	}
	else if(args.length < 1) {
		msg.channel.sendMessage("You did not define an argument. Usage: `${config.prefix}setPrefix [prefix]`"); //check for game
		return deleteAfterTime(msg, 5000, 2);
	}
	try {
		msg.channel.sendMessage("Prefix being changed please wait...");
		config.prefix = args[0];
	}
	catch(e) {
		msg.channel.sendMessage(`${e}`);
		console.log(e);
	}
}

export function setWelcome(msg, args) {
	if(!msg.user.hasRole(adminRole)) {
		return msg.reply("You pleb, you don't have permission to use this command `${config.prefix}setWelcome`."); //insult unauthorized user
	}
	else if(args.length < 1) {
		msg.channel.sendMessage("You did not define an argument. Usage: `${config.prefix}setWelcome [message]`"); //check for game
		return deleteAfterTime(msg, 5000, 2);
	}
	try {
		msg.channel.sendMessage("Welcome message being changed please wait...");
		let dmTag = "--dm";
		if(args.indexOf(dmTag) != -1){
			config.welcome_pm = removeElement(args, dmTag).join(" ");
		}
		else {
			config.welcome_msg = args.join(" ");
		}
	}
	catch(e) {
		msg.channel.sendMessage(`${e}`);
		console.log(e);
	}
}

export function setGoodbye(msg, args) {
	if(!msg.user.hasRole(adminRole)) {
		return msg.reply("You pleb, you don't have permission to use this command `${config.prefix}setGoodbye`."); //insult unauthorized user
	}
	else if(args.length < 1) {
		msg.channel.sendMessage("You did not define an argument. Usage: `${config.prefix}setGoodbye [message]`"); //check for game
		return deleteAfterTime(msg, 5000, 2);
	}
	try {
		msg.channel.sendMessage("Goodbye message being changed please wait...");
		config.goodbye_pm = args.join(" ");
	}
	catch(e) {
		msg.channel.sendMessage(`${e}`);
		console.log(e);
	}
}
