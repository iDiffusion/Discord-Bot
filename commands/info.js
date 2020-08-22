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
		if (args.length == 0) {
			return base.utils.noArgsFound(msg, prefix, this);
		} else if (args[0].toString().toLowerCase() == 'server') {
			let guild = msg.channel.guild;
			let botCount = guild.members.filter(mem => mem.user.bot).array().length;
			msg.channel.send({
				embed: {
			  		color: 262088,
			  		title: `Server info for ${guild.name}`,
			  		description: `**Guild ID:** ${guild.id}\n` +
						`**Created:** ${new Date(guild.createdAt).toUTCString()}\n` +
						`**Owner:** ${guild.owner.user.tag}\n` +
						`**Members:** ${guild.members.size - botCount} **Bots:** ${botCount}\n` +
						`**Icon URL:** ${guild.iconURL}`,
			  		thumbnail: {
						url: guild.iconURL
			  		},
			  		timestamp: new Date()
				}
		  	});
			if(base.debug) consoele.log(guild);
		} else {
			try {
				let user = args[0].toString().toLowerCase() == 'bot' ? base.bot.user : msg.mentions.users.first();
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
				if (base.debug) console.log(user);
		  	} catch (e) {
				if (base.debug) console.log(e);
				return base.utils.noArgsFound(msg, prefix, this);
		  	}
		}
	}
};
