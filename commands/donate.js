module.exports = {
	name: "donate",
  	aliases: ["donate"],
 	description: "This command will send a link to members who wish to donate to the server.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "donate",
	examples: ["donate"],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		return `pong!\`${Math.ceil(base.bot.ping)}ms\``;
	}
};
