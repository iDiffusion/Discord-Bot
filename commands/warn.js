module.exports = {
	name: "warn",
  	aliases: ["warn"],
 	description: "This command sends a warning message to specified member of the server. It also logs the message sent.",
	permissionsBot: [],
	permissionsUser: ["MANAGE_ROLES"],
	channels: ["text"],
	cooldown: 1,
	usage: "warn [user] [message]",
	examples: ["warn @pyro Please stop spamming"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write points command
	}
};
