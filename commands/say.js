module.exports = {
	name: "say",
  	aliases: ["say", "echo"],
 	description: "This command will say the message from the bot account, therefore making the message anonymous.",
	permissionsBot: ["MENTION_EVERYONE", "SEND_TTS_MESSAGES", "EMBED_LINKS"],
	permissionsUser: ["DEVELOPER"],
	channels: ["text"],
	cooldown: 1,
	usage: "say [message]",
	examples: ["say Hello world!"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write say command
	}
};
