module.exports = {
	name: "mute",
  	aliases: ["mute"],
 	description: "This command will mute a user for a certain duration.",
	permissionsBot: ["MUTE_MEMBERS"],
	permissionsUser: ["MUTE_MEMBERS"],
	channels: ["text"],
	cooldown: 1,
	usage: "mute [user] [seconds]",
	examples: ["mute @pyro 600"],
	enable: false,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write mute command
	}
};
