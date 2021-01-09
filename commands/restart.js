module.exports = {
	name: "restart",
  	aliases: ["restart"],
 	description: "This command will allow admins to restart the bot or the server.",
	permissionsBot: [],
	permissionsUser: ["DEVELOPER"],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "restart",
	examples: ["restart"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write restart command
	}
};
