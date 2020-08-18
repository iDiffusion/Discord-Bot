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
		let donate_link = base.auth.donate_link ? base.auth.donate_link : "https://www.paypal.me/ikaikalee";
	    base.utils.sendEmbed(msg,`If you would like to make any donations, please use the following link:\n${donate_link}`);
	}
};
