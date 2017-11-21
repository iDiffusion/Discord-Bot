//this is a test file

const config = require("./config.json"); // import the config file

export function setGame(msg, args, adminRole) {
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

export function setPrefix(msg, prefix, adminRole){
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

export function setWelcome(msg, args, adminRole) {
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

export function setGoodbye(msg, args, adminRole) {
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
