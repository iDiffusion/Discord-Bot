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
		let userToKick = msg.mentions.users.first();
        if (!userToKick) {
            return base.utils.noArgsFound(msg, prefix, this, 5, 16733186);
        }
        if (userToKick.hasPermission('ADMINISTRATOR')) {
            return base.utils.sendEmbed(msg, `Im sorry to inform you but you are unable to kick your equals.`, 5, 16733186);
        }
        let kickMsg = args.slice(1).join(" ");
        base.utils.sendActionToDM(msg, "Kicked", 16733186, userToKick, kickMsg);
        base.utils.sendActionToModlog(msg, "Kicked", 16733186, userToKick, kickMsg);
        msg.guild.member(userToKick).kick();
        base.usersRemoved.push(userToKick);
    }
};
