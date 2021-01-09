module.exports = {
	name: "status",
  	aliases: ["status", "stat"],
 	description: "This command will display the current status of the bot.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "status",
	examples: ["status"],
	enable: false,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write status command
	}
};
