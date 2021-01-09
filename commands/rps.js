module.exports = {
	name: "rps",
  	aliases: ["rps", "rockpaperscissors"],
 	description: "This command will play rock paper scissors with the bot.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "rps [item]",
	examples: ["rps rock", "rps scissor", "rps paper"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write rps command
	}
};
