module.exports = {
	name: "broadcast",
  	aliases: ["broadcast","announce"],
 	description: "This command will say the message from the bot account to all servers its a part of.",
	permissionsBot: [],
	permissionsUser: ["BOT_DESIGNER"],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "broadcast [message]",
	examples: ["broadcast Hello world!"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		if (args.length == 1) return base.utils.noArgsFound(base);
		base.bot.guilds.map( guild => {
			let channel = guild.channels.find(x => x.name == "mod_log");
			channel = channel ? channel : guild.channels.find(x => x.name == "general");
			channel = channel ? channel : guild.channels[0];
			channel.send({
				embed: {
					color: 3447003,
					description: args.slice(1).join(" "),
					timestamp: new Date(),
					footer: {
						icon_url: msg.author.avatarURL,
						text: msg.author.tag
					}
				}
			});
		});
	}
};
