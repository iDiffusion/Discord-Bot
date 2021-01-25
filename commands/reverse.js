module.exports = {
	name: "reverse",
	aliases: ["reverse"],
	description: "This command allows will ask the bot to reverse the word or sentence given to it.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "reverse [word]",
	examples: ["reverse racecar"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		if (args.length == 0) return base.utils.noArgsFound(msg, prefix, this);
		let letters = args.join(" ").split("");
		letters.reverse();
		base.utils.sendEmbed(msg, `Your message reversed is **${letters.join("")}**.`);
	}
};
