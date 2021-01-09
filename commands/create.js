module.exports = {
	name: "create",
  	aliases: ["create"],
 	description: "This command will be used to create new channel groups for communities.",
	permissionsBot: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	permissionsUser: ['ADMINISTRATOR'],
	channels: ["text"],
	cooldown: 1,
	usage: "create [Abbreviation] [Game]",
	examples: ["create ARK Ark Survival Evolved"],
	enable: false,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		//TODO write create command
	}
};
