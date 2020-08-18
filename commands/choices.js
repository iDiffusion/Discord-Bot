
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
			base.utils.noArgsFound(msg, prefix, this);
		} else if (args.length == 1) {
			base.utils.sendEmbed(msg,`I choose **${args[0].trim()}**.`);
		} else {
			base.utils.sendEmbed(msg, `I choose **${base.utils.sample(args)}**.`);
		}
	}
};
