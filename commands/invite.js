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
        let guild = base.mysql.guild(base, msg.guild);
        if (args.length < 1) {
            base.utils.noArgsFound(msg, prefix, this);
        } else if (args[0].toLowerCase().startsWith("perm")) {
            if (guild.server_link) {
                base.utils.sendEmbed(msg, `${guild.get('InvitePerm')} is a permanent link for new members.`);
            } else {
                msg.channel.createInvite({
                    maxAge: 0
                }).then(permlink => {
                    base.utils.sendEmbed(msg, `${permlink.url} is a permanent link for new members.`);
					guild.set('InvitePerm', permlink);
                });
            }
        } else if (args[0].toLowerCase().startsWith("temp")) {
            if (guild && guild.temp_link) {
                base.utils.sendEmbed(msg, `${guild.temp_link} is a temp link for visiting members.`);
            } else {
                msg.channel.createInvite({
                    temporary: true,
                    maxAge: 0
                }).then(templink => {
                    base.utils.sendEmbed(msg, `${templink.url} is a temp link for visiting members.`);
					guild.set('InviteTemp', templink);
                });
            }
        } else if (args[0].toLowerCase().startsWith("bot")) {
			if(base.auth.bot_link){
				base.utils.sendEmbed(msg, `${base.auth.bot_link} is a invite link for me.`);
			} else {
				let link = "https://discordapp.com/api/oauth2/authorize?client_id=264995143789182976&permissions=8&scope=bot";
            	base.utils.sendEmbed(msg, `${link} is a invite link for me.`);
				base.auth.bot_link = link;
			}
        } else {
            base.utils.noArgsFound(msg, prefix, this);
        }
    }
};
