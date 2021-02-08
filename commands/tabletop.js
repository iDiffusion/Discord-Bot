module.exports = {
    name: "tabletop",
    aliases: ["tabletop", "tt"],
    description: "This command creates a text channel used for events.",
    permissionsBot: ["MANAGE_CHANNELS"],
    permissionsUser: ["MANAGE_CHANNELS"],
    channels: ["text"],
    cooldown: 1,
    usage: "tabletop",
    examples: ["tabletop"],
    enable: true,
    deleteCmd: 0,
    deleteResp: -1,
    execute(base, prefix, msg, args) {
        let table = msg.guild.channels.cache.find(c => c.name == "tabletop");
        if (!table) {
            msg.guild.channels.create("tabletop", {
                    type: "text",
                    permissionOverwrites: [{
                        'id': msg.guild.id,
                        'allow': ["CREATE_INSTANT_INVITE", "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES"]
                    }, {
                        'id': msg.author.id,
                        'allow': ["MANAGE_MESSAGES", "MANAGE_CHANNELS"]
                    }]
                })
                .then(console.log);
            base.utils.sendEmbed(msg, `Text channal named #tabletop has been created. Admins please use \`${prefix + this.usage}\` to delete the channel after use.`);
        } else {
            table.delete();
            base.utils.sendEmbed(msg, `Text channel named #tabletop has been deleted.`);
        }

    }
};
