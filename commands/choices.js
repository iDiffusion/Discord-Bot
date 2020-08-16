module.exports = {
	name: "choices",
  	aliases: ["choose", "choice", "choices"],
 	description: "This command will allow the bot to choose between choices provided to her.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "choose [choice1, choice2...]",
	examples: ["choose sleep, games"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		args = args.join(" ").split(",").filter(s => s);
		if (args.length == 0) {
			return base.utils.noArgsFound(base);
		} else if (args.length == 1) {
			return `I choose **${args[0].trim()}**.`;
		} else {
			return `I choose **${underscore.sample(args).trim()}**.`;
		}
	}
};
