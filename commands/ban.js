module.exports = {
    name: "ban",
    aliases: ["ban"],
    description: "This command bans the specified member from the server while sending them a message and logging the reason.",
    permissionsBot: ["BAN_MEMBERS"],
    permissionsUser: ["BAN_MEMBERS"],
    channels: ["text"],
    cooldown: 1,
    usage: "ban [user] [reason]",
    examples: ["ban @pyro spamming"],
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
        let banMsg = args.slice(1).join(" ");
        base.utils.sendActionToDM(msg, "Banned", 16721408, userToBan, banMsg);
        base.utils.sendActionToModlog(msg, "Banned", 16721408, userToBan, banMsg);
        msg.guild.member(userToBan).ban();
        base.bot.usersRemoved.push(userToBan);
    }
};
