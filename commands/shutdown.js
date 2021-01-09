module.exports = {
	name: "shutdown",
  	aliases: ["shutdown"],
 	description: "This command will allow admins to shutdown the bot or the server.",
	permissionsBot: [],
	permissionsUser: ["DEVELOPER"],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "shutdown",
	examples: ["shutdown"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write shutdown command
	}
};
