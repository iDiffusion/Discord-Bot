module.exports = {
	name: "softban",
  	aliases: ["softban"],
 	description: "This command kicks a member from the server, deleting all messages in chat from that user, sends them a message and logs the reason.",
	permissionsBot: ["BAN_MEMBERS"],
	permissionsUser: ["KICK_MEMBERS"],
	channels: ["text"],
	cooldown: 1,
	usage: "softban [user] [reason]",
	examples: ["softban @pyro spamming"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		if (args.length < 2) {
			return base.utils.noArgsFound(msg, prefix, this, 3, 16733186);
		}
		let userToKick = msg.mentions.members.first();
		if (!userToKick) {
			return base.utils.noArgsFound(msg, prefix, this, 5, 16733186);
		}
		if (userToKick.hasPermission('ADMINISTRATOR')) {
			return base.utils.sendEmbed(msg, `Im sorry to inform you but you are unable to kick your equals.`, 5, 16733186);
		}
		let kickMsg = args.slice(1).join(" ");
		msg.guild.members.ban(userToKick, {reason: kickMsg});
		msg.guild.members.unban(userToKick, {reason: "Softban only"});
		base.utils.sendActionToDM(msg, "Soft Banned", 16733186, userToKick, kickMsg);
		base.utils.sendActionToModlog(msg, "Soft Banned", 16733186, userToKick, kickMsg);
		base.usersRemoved.push(userToKick);
	}
};
