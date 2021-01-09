module.exports = {
	name: "top",
  	aliases: ["top"],
 	description: "This command will display the top ranked users of the server, along with their level and points.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "top",
	examples: ["top"],
	enable: false,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
    	//TODO write top command
	}
};
