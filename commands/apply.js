module.exports = {
	name: "apply",
  	aliases: ["apply", "app"],
 	description: "This command allows users to apply for roles that they wish to obtain. They can do so by stating a reason why they wish to be approved.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text"],
	cooldown: 1,
	usage: "apply [role] [reason]",
	examples: ["apply Mod I can help to moderate the server."],
	enable: true,
	deleteCmd: 0,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		//check for roles and reason
	    if (args.length < 2) {
	    	return base.utils.noArgsFound(msg, prefix, this, 5);
	    }

		//assume that the role is specified
		var role = msg.mentions.roles.first();
		var reasonFor = args.join(" ");

		//otherwise the role name should be the first args
		if (!role) {
			role = msg.guild.roles.find(r => args[0].toLowerCase().includes(r.name.toLowerCase()));
			reasonFor = args.slice(1).join(" ");
		}

		// if no role return no args found
	    if (!role) {
	    	return base.utils.noArgsFound(msg, prefix, this, 5);
	    }

		// send request to modlog
	    msg.guild.channels.find(c => c.name == "mod_log").send({
		    embed: {
		        color: 7013119,
		        author: {
		            name: msg.author.username,
		            icon_url: msg.author.avatarURL
		        },
		        title: "Role Application",
		        description: `${msg.author} has applied for the **${role.name}** Role`,
		        fields: [{
		            name: "Reason",
		            value: reasonFor
		        }],
		        timestamp: new Date()
		    }
		}).catch(console.error);
	}
};
