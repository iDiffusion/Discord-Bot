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
		if (args.length < 3) {
			base.utils.sendEmbed(msg, base.utils.noArgsFound(base), 16733186, 3);
			return;
		}
		try {
			let userToKick = msg.mentions.users.first();
			let kickMsg = args.slice(2).join(" ");
			msg.guild.member(userToKick).kick();+
			sendToDM(msg, "Kicked", 16733186, userToKick, kickMsg);
			sendToModlog(msg, "Kicked", 16733186, userToKick, kickMsg);
			usersRemoved.push(userToKick);
		} catch (e) {
			base.utils.sendEmbed(msg, base.utils.noArgsFound(base), 16733186, 3);
			return;
		}
	}
};
