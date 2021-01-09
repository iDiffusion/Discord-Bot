module.exports = {
    name: "level",
    aliases: ["level", "lvl"],
    description: "This command will allow users to find out what level a specified person is and the amount of points said person has earned.",
    permissionsBot: [],
    permissionsUser: [],
    channels: ["text", "dm"],
    cooldown: 1,
    usage: "level [user]",
    examples: ["level @pyro"],
    enable: false,
    deleteCmd: -1,
    deleteResp: -1,
    execute(base, prefix, msg, args) {
        //TODO write level command
    }
};
