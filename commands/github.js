module.exports = {
	name: "github",
  	aliases: ["github", "creator", "source", "src"],
 	description: "This command will display a link to the source code for this bot.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "github",
	examples: ["github"],
	enable: true,
	deleteCmd: 0,
	deleteResp: 5,
	execute(base, prefix, msg, args) {
		base.utils.sendEmbed(msg, `The creator of this bot is: Diffusion#4795. The source code for the bot is at https://github.com/iDiffusion/Discord-Bot .`);
	}
};
