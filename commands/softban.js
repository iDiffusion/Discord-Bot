module.exports = {
	name: "softban",
  	aliases: ["softban"],
 	description: "This command kicks a member from the server, deleting all messages in chat from that user, sends them a message and logs the reason.",
	permissionsBot: ["BAN_MEMBERS"],
	permissionsUser: ["KICK_MEMBERS"],
	channels: ["text"],
	cooldown: 1,
	usage: "softban [user] [reason]",
	examples: ["softban @pyro spamming"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write softban command
	}
};
