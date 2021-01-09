module.exports = {
    name: "whitelist",
    aliases: ["whitelist", "wl"],
    description: "This command keep a specified user from being limited by the bot or users.",
    permissionsBot: [],
    permissionsUser: ["DEVELOPER"],
    channels: ["text", "dm"],
    cooldown: 1,
    usage: "whitelist [user]",
    examples: ["whitelist @pyro"],
    enable: false,
    deleteCmd: 0,
    deleteResp: -1,
    execute(base, prefix, msg, args) {
        try {
            let users = msg.mentions.users.array();
            if (args.indexOf('-r') != -1) {
                //TODO remove user from whitelist
                console.log(`Users have been removed from the whitelist.`, users);
            } else if (args.indexOf('-a') != -1) {
                let reason = args.join(" ");
                //TODO add user to whitelist
                console.log(`Users have been added to the whitelist.`, users);
            } else {
                //TODO display whitelisted users
                console.log(`There are no whitelisted users at this time.`, users);
            }
        } catch (e) {
            return base.utils.noArgsFound(msg, prefix, this, 5);
        }
    }
};
