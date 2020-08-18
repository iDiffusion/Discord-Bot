module.exports = {
	name: "kick",
  	aliases: ["kick"],
 	description: "This command kicks members from the server while sending them a message and logging the reason.",
	permissionsBot: ["KICK_MEMBERS"],
	permissionsUser: ["KICK_MEMBERS"],
	channels: ["text"],
	cooldown: 1,
	usage: "kick [user] [reason]",
	examples: ["kick @pyro trolling"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		if (args.length < 2) {
			return base.utils.noArgsFound(msg, prefix, this, 3, 16733186);
		}
		try {
			let userToKick = msg.mentions.users.first();
			let kickMsg = args.slice(1).join(" ");
			msg.guild.member(userToKick).kick();
			base.utils.sendActionToDM(msg, "Kicked", 16733186, userToKick, kickMsg);
			base.utils.sendActionToModlog(msg, "Kicked", 16733186, userToKick, kickMsg);
			base.usersRemoved.push(userToKick);
		} catch (e) {
			base.utils.noArgsFound(msg, prefix, this, 3, 16733186);
			return;
		}
	}
};
