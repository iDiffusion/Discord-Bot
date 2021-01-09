module.exports = {
    name: "points",
    aliases: ["points", "point"],
    description: "This command will allow users to find out how many points a specified person has.",
    permissionsBot: [],
    permissionsUser: [],
    channels: ["text", "dm"],
    cooldown: 1,
    usage: "points [user]",
    examples: ["points @pyro"],
    enable: false,
    deleteCmd: 0,
    deleteResp: -1,
    execute(base, prefix, msg, args) {
    	//TODO write points command
    }
};
