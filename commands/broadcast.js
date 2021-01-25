module.exports = {
	name: "broadcast",
  	aliases: ["broadcast","announce"],
 	description: "This command will say a message from the bot account to all servers it's a part of.",
	permissionsBot: [],
	permissionsUser: ["DEVELOPER"],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "broadcast [message] -f",
	examples: ["broadcast Hello world! -f"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		var flag = args.indexOf('-f');
		if (args.length == 0 || flag == -1) {
			return base.utils.noArgsFound(msg, prefix, this, 5);
		}
		args.splice(flag, 1);
		base.bot.guilds.cache.map( guild => {
			let channel = guild.channels.cache.find(x => x.name == "mod_log");
			channel = channel || guild.channels.cache.find(x => x.name == "general");
			channel = channel || guild.channels.cache.array()[0];
			channel.send({
				embed: {
					color: 3447003,
					description: args.join(" "),
					timestamp: new Date(),
					footer: {
						icon_url: msg.author.avatarURL,
						text: msg.author.tag
					}
				}
			}).catch(console.error);
		});
	}
};
