module.exports = {
    name: "prisolis",
    aliases: ["prisolis", "zeadron"],
    description: "This command creates a channel used for “Storytime with Mr.Z”, aka Zeadron, as he develops his new book.",
    permissionsBot: ["MANAGE_CHANNELS", "MOVE_MEMBERS"],
    permissionsUser: ["MOVE_MEMBERS"],
    servers: ["212624757818916864"],
    channels: ["text", "dm"],
    cooldown: 1,
    usage: "prisolis",
    examples: ["prisolis"],
    enable: true,
    deleteCmd: -1,
    deleteResp: -1,
    execute(base, prefix, msg, args) {
        let channelName = "Story Time w/ Mr.Z";
        //if (base.msg.guild.id != 212624757818916864) return;
        if (msg.author.id != 222883669377810434 && !msg.member.hasPermission('ADMINISTATOR')) {
            return base.utils.unauthorizedUser(base);
        }
        let storyTime = msg.guild.channels.cache.find(c => c.name == channelName);
        if (!storyTime) {
            msg.guild.channels.create(channelName, {
                    type: 'voice',
                    permissionOverwrites: [{
                        'id': msg.guild.id,
                        'allow': ['CREATE_INSTANT_INVITE', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK']
                    }, {
                        'id': 222883669377810434,
                        'allow': ['MOVE_MEMBERS', 'PRIORITY_SPEAKER', 'MUTE_MEMBERS', 'USE_VAD']
                    }]
                })
                .then(console.log);
            base.utils.sendEmbed(msg, `Voice channel named \`${channelName}\` has been created. Use \`?prisolis\` to delete the channel after use.`);
        } else {
            let mem_array = storyTime.members.array();
            try {
                let moveToChannel = msg.guild.channels.cache.find("name", "General");
                if (!moveToChannel) {
                    throw "No General Chat Found";
                }
                mem_array.map(id => msg.guild.member(id).setVoiceChannel(moveToChannel).catch(console.error));
            } catch (e) {
                console.error(e);
                //TODO move to first voice channel
            }
            storyTime.delete().catch(console.error);
            base.utils.sendEmbed(msg, `Voice channel named \`${channelName}\` has been deleted.`);
        }
    }
};
