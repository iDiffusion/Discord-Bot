module.exports = {
	name: "rolldice",
	aliases: ["rolldice", "dice", "roll"],
	description: "This command will ask the bot to roll a die or dice and return the result. (max of 10 dice, max of 100 sides)",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "rolldice [number of dice]d[number of sides]",
	examples: ["rolldice", "rolldice 5", "rolldice 4d20"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		const numLimit = 10;
		const sideLimit = 100;
		try {
			if (args[0].indexOf("d") != -1) {
				args = args.join("").split("d");
			} else {
				args[1] = "6";
			}
			let valArray = [];
			args[0] = args[0] < numLimit ? args[0] : numLimit;
			args[1] = args[1] < sideLimit ? args[1] : sideLimit;
			for (i = 1; i <= args[0]; i++) { //repeat for the number of die
				let tempVal = Math.floor(Math.random() * args[1]) + 1;
				if (tempVal > args[1]) { //check for outofbounds case
					tempVal = args[1];
				}
				valArray.push(tempVal);
			}
			let sum = valArray.reduce((total, current) => current += total);
			let average = Math.round(sum / valArray.length * 100) / 100;
			base.utils.sendEmbed(msg, `Your rolls are: \`${valArray.join(", ")}\`\nThe sum is **${sum}** and the average is **${average}**.`);
		} catch (err) {
			return base.utils.noArgsFound(msg, prefix, this);
		}
	}
};
