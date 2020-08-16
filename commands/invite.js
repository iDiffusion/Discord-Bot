module.exports = {
	name: "invite",
  	aliases: ["invite", "inv"],
 	description: "This command will send links to member who would like to invite people, to ensure that all new members are sent to the #information page first.",
	permissionsBot: ["CREATE_INSTANT_INVITE"],
	permissionsUser: [],
	channels: ["text"],
	cooldown: 1,
	usage: "invite [perm|temp|bot]",
	examples: ["invite perm", "info temp", "invite bot"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		let config = base.config.find(g => g.id == msg.guild.id);
		if (args.length > 0) {
			if (args[0].toLowerCase().startsWith("perm")) {
				if (config && config.server_link) {
					return `${config.server_link} is a permanent link for new members.`;
				} else {
					msg.channel.createInvite({
						maxAge: 0
					}).then(permlink => {
						base.utils.sendEmbed(msg, `${permlink.url} is a permanent link for new members.`);
					});
				}
			} else if (args[0].toLowerCase().startsWith("temp")) {
				if (config && config.temp_link) {
					return `${config.temp_link} is a temp link for visiting members.`;
				} else {
					msg.channel.createInvite({
						temporary: true,
						maxAge: 0
					}).then(templink => {
						base.utils.sendEmbed(msg, `${templink.url} is a temp link for visiting members.`);
					});
				}
			} else if (args[0].toLowerCase().startsWith("bot")) {
				let auth = base.auth;
				let link = auth && auth.bot_link ? auth.bot_link : "https://discordapp.com/api/oauth2/authorize?client_id=264995143789182976&permissions=8&scope=bot";
				return `${link} is a invite link for me.`;
			} else {
				return base.utils.noArgsFound(base);
			}
		} else {
			return base.utils.noArgsFound(base);
		}
	}
};
