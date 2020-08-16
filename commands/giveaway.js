module.exports = {
	name: "giveaway",
  	aliases: ["giveaway", "winner"],
 	description: "This command will take the reactions off a message and pick a random user.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text"],
	cooldown: 1,
	usage: "giveaway [msg id]",
	examples: ["giveaway 123456789"],
	enable: false,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		//TODO change to message.createReactionCollector(filter, [option]);
	    let message = msg.channel.fetchMessage(base.args[1])
	    	.then(message => message.reactions)
			.then(reactions => {
	    		reactions.array().map(react => {
					//TODO get users from reaction
				})
			})
			.catch(console.error);
		return base.utils.noArgsFound(base);
	}
};
