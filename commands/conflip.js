module.exports = {
	name: "coinflip",
  	aliases: ["coinflip", "coin", "flip", "cointoss", "toss"],
 	description: "This command will ask the bot to flip a coin, then return the result.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "coinflip",
	examples: ["coinflip"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		let choices = ["Head", "Tail"];
	    let result = base.utils.sample(choices);
	    base.sendEmbed(msg,`Result is ${result}.`);
	}
};
