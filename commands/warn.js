module.exports = {
	name: "warn",
  	aliases: ["warn"],
 	description: "This command sends a warning message to specified member of the server. It also logs the message sent.",
	permissionsBot: [],
	permissionsUser: ["MANAGE_ROLES"],
	channels: ["text"],
	cooldown: 1,
	usage: "warn [user] [message]",
	examples: ["warn @pyro Please stop spamming"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		if (args.length < 2) {
            return base.utils.noArgsFound(msg, prefix, this, 3, 16774400);
        }
		let userToWarn = msg.mentions.members.first();
        if (!userToWarn) {
            return base.utils.noArgsFound(msg, prefix, this, 5, 16774400);
        }
        if (userToWarn.hasPermission('ADMINISTRATOR')) {
            return base.utils.sendEmbed(msg, `Im sorry to inform you but you are unable to warn your equals.`, 5, 16774400);
        }
        let warnMsg = args.slice(1).join(" ");
        base.utils.sendActionToDM(msg, "Warned", 16774400, userToWarn, warnMsg);
        base.utils.sendActionToModlog(msg, "Warned", 16774400, userToWarn, warnMsg);
	}
};
