module.exports = {
	name: "set",
  	aliases: ["set"],
 	description: "This command allows admins or owners to set key functionailty of the bot such as prefix, welcome/goodbye messages and game of the bot.",
	permissionsBot: [],
	permissionsUser: ["DEVELOPER"],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "set [property] [value]",
	examples: ["set welcome Hey $mention welcome to ther server!", "set goodbye We're sad to see you go but if you would like to come back $link", "set prefix !", "set game League of Legends"],
	enable: false,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write set command
	}
};
