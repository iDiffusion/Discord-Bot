module.exports = {
	name: "clean",
  	aliases: ["clean"],
 	description: "This command will delete all messages in pm chat sent by the bot.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["dm"],
	cooldown: 1,
	usage: "clean",
	examples: ["clean"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		msg.channel.fetchMessages().then(msgs => {
	    	let msg_array = msgs.filter(m => m.author.id == base.bot.user.id);
	    	msg_array.array().map(m => m.delete().catch(console.error));
		});
	}
};
