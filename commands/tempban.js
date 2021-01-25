module.exports = {
    name: "tempban",
    aliases: ["tempban"],
    description: "This command bans the specified member for a number of days from the server while sending them a message and logging the reason.",
    permissionsBot: ["BAN_MEMBERS"],
    permissionsUser: ["BAN_MEMBERS"],
    channels: ["text"],
    cooldown: 1,
    usage: "tempban [user] [reason] ]-d [number]]",
    examples: ["tempban @pyro spamming", "tempban @pyro spamming -d 7"],
    enable: true,
    deleteCmd: 0,
    deleteResp: -1,
    execute(base, prefix, msg, args) {
        if (args.length < 2) {
            return base.utils.noArgsFound(msg, prefix, this, 5, 16721408);
        }
        let userToBan = msg.mentions.members.first();
        if (!userToBan) {
            return base.utils.noArgsFound(msg, prefix, this, 5, 16721408);
        }
        if (userToBan.hasPermission('ADMINISTRATOR')) {
            return base.utils.sendEmbed(msg, `Im sorry to inform you but you are unable to ban your equals.`, 5);
        }

        let flag = args.indexOf('-d');
        let days = 7;
		if ( flag != -1 ) {
            days = args[flag + 1];
            args.splice(flag, 2);
		}
        if ( !Number.isInteger( days ) ) {
            return base.utils.sendEmbed(msg, `Im sorry to inform you but ${days} is not a number.`, 5);
        }
        let banMsg = args.slice(1).join(" ");
        msg.guild.member(userToBan).ban({days: days, reason: banMsg});
        base.utils.sendActionToDM(msg, "Banned", 16721408, userToBan, banMsg);
        base.utils.sendActionToModlog(msg, "Banned", 16721408, userToBan, banMsg);
        base.bot.usersRemoved.push(userToBan);
    }
};
