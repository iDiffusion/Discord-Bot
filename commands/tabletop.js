module.exports = {
	name: "tabletop",
  	aliases: ["tabletop", "tt"],
 	description: "This command creates a text channel used for events.",
	permissionsBot: ["MANAGE_CHANNELS"],
	permissionsUser: ["MANAGE_CHANNELS"],
	channels: ["text"],
	cooldown: 1,
	usage: "tabletop",
	examples: ["tabletop"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write tabletop command
	}
};
