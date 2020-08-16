module.exports = {
	name: "info",
  	aliases: ["info", "411", "i", "information"],
 	description: "This command will display information about the server, or a specified user.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "info [server|user|bot]",
	examples: ["info", "info server", "info @pyro"],
	enable: true,
	deleteCmd: 0,
	deleteResp: 10,
	execute(base, prefix, msg, args) {
		if (base.args.length == 0) {
			return base.utils.noArgsFound(base);
		} else if (base.args[1].toString().toLowerCase() == 'server') {
			let guild = msg.channel.guild;
			let botCount = guild.members.filter(mem => mem.user.bot).array().length;
			msg.channel.send({
				embed: {
			  		color: 262088,
			  		title: `Server info for ${guild.name}`,
			  		description: `**Guild Id:** ${guild.id}\n` +
						`**Created:** ${new Date(guild.createdAt).toUTCString()}\n` +
						`**Owner:** ${guild.owner.displayName}\n` +
						`**Members:** ${guild.members.size - botCount} **Bots:** ${botCount}\n` +
						`**Icon URL:** ${guild.iconURL}`,
			  		thumbnail: {
						url: guild.iconURL
			  		},
			  		timestamp: new Date()
				}
		  	});
		} else {
			try {
				let user = base.args[0].toString().toLowerCase() == 'bot' ? base.bot.user : msg.mentions.users.first();
				if (base.debug) console.log(user);
				msg.channel.send({
					embed: {
						color: 3447003,
						title: `User info for ${user.tag}`,
						description: `**Username:** ${user.username} **Nickname:** ${msg.guild.member(user).displayName}\n` +
							`**User ID:** ${user.id}\n` +
							`**Discriminator:** ${user.discriminator}\n` +
							`**Created:** ${new Date(user.createdAt).toUTCString()}\n` +
							`**Joined:** ${new Date(msg.guild.member(user).joinedTimestamp).toUTCString()}\n` +
							`**Avatar URL:** ${user.avatarURL}`,
							thumbnail: {
			  					url: user.avatarURL
							},
						timestamp: new Date()
		  			}
				});
		  	} catch (e) {
				console.log(e);
				return base.utils.noArgsFound(base);
		  	}
		}
	}
};
