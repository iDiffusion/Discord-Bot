module.exports = {
	name: "purge",
  	aliases: ["purge"],
 	description: "This command removes a specified number of messages from the channel. Flags or filters can be added to further specify the messages, such filters would remove messages of a specific content or from a specific author.",
	permissionsBot: ["MANAGE_MESSAGES"],
	permissionsUser: ["MANAGE_MESSAGES"],
	channels: ["text"],
	cooldown: 1,
	usage: "purge [number] [filters]",
	examples: ["purge 5", "purge 5 @pyro"],
	enable: true,
	deleteCmd: 0,
	deleteResp: 5,
	execute(base, prefix, msg, args) {
    	//TODO write purge command
	}
};
