module.exports = {
    name: "blacklist",
    aliases: ["blacklist", "bl", "ignoreuser"],
    description: "This command bans the specified user from using the bot commands and logging the reason.",
    permissionsBot: [],
    permissionsUser: ["BOT_DESIGNER"],
    channels: ["text", "dm"],
    cooldown: 1,
    usage: "blacklist [user] [reason]",
    examples: ["blacklist @pyro spamming"],
    enable: false,
    deleteCmd: 0,
    deleteResp: -1,
    execute(base, prefix, msg, args) {
        try {
            let users = msg.mentions.users.array();
            if (args.indexOf('-r') != -1) {
                //TODO remove user from blacklist
                console.log(`Users have been removed from the blacklist.`, users);
            } else if (args.indexOf('-a') != -1) {
                let reason = args.join(" ");
                //TODO add user to blacklist
                console.log(`Users have been added to the blacklist.`, users);
            } else {
                //TODO display blacklisted users
                console.log(`There are no blacklisted users at this time.`, users);
            }
        } catch (e) {
            return base.utils.noArgsFound(msg, prefix, cmd, 5);
        }
    }
};
