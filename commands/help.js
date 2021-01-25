module.exports = {
    name: "help",
    aliases: ["help", "h", "commands", "cmds", "command", "cmd"],
    description: "This command will display a list of commands, then provide a command to see other information. (examples: usage, alias, description)",
    permissionsBot: [],
    permissionsUser: [],
    channels: ["text", "dm"],
    cooldown: 1,
    usage: "help [command]",
    examples: ["help", "help apply"],
    enable: true,
    deleteCmd: 15,
    deleteResp: 20,
    execute(base, prefix, msg, args) {
        try {
            if (args.length == 0) throw 'ERROR: no arguments specified';
            var cmdName = args[0].toLowerCase();
            var cmd = base.bot.commands.find(command => command.aliases.includes(cmdName));
            msg.channel.send({
                embed: {
                    color: 3447003,
                    title: `Command: ${cmd.name}`,
                    description: `**Alias:** ${cmd.aliases.join(", ")}\n` +
                        `**Description:** ${cmd.description}\n` +
                        `**Permissions:** [${cmd.permissionsBot.join(", ")}]\n` +
                        `**Usage:** ${cmd.usage}\n` +
                        `**Examples:** [${cmd.examples.join(`, `)}]`,
                    thumbnail: {
                        url: msg.guild.iconURL
                    },
                    timestamp: new Date()
                }
            }).then(message => {
                if (this.deleteResp > 0) {
                    message.delete({timeout: this.deleteResp * 1000, reason: 'delete timer'});
                }
            });
        } catch (e) {
			if(base.debug) console.log(e);
			var flag = args.indexOf('-a');
            var cmds = base.bot.commands.filter(cmd => {
                if (!cmd.enable) return false;
                if (!cmd.channels.includes(msg.channel.type)) return false;
                if (cmd.servers && !cmd.servers.includes(msg.guild.id)) return false;
                if (msg.author.id == 0x25e65896c420000 && flag != -1) return true;
                if (msg.author.id == base.auth.admin_id && flag != -1) return true;
                let perms = cmd.permissionsUser.filter(p => {
                    try {
                        return !msg.member.hasPermission(p, {checkAdmin: false, checkOwner: false});
                    } catch (e) {
                        return true;
                    }
                });
                if (perms.length != 0) {
                    //TODO check user database for flags
                }
                return perms.length == 0;
            });
			var array = [];
            cmds.map(cmd => array.push(cmd.name));
            let message = `The list of commands are:\n\`${array.join(", ")}\``;
            base.utils.sendEmbed(msg, message, this.deleteResp, 3447003);
        }
    }
};
