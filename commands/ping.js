module.exports = {
	name: "ping",
  	aliases: ["ping"],
 	description: "This command will test if the bot in online and the time it takes to respond.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "ping",
	examples: ["ping"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		msg.channel.send('Pong!')
		.then( newMsg => newMsg.edit(`Pong! \`${Math.ceil(base.bot.ping)}ms\``))
		.catch(console.error);
	}
};
