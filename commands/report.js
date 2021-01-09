module.exports = {
	name: "report",
  	aliases: ["report", "bugreport", "bug"],
 	description: "This command will send bug information to the creator of this bot.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "report [message]",
	examples: ["report Bot not responding"],
	enable: false,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write report command
	}
};
