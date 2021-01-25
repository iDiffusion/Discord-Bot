module.exports = {
    name: "purge",
    aliases: ["purge"],
    description: "This command removes a specified number of messages from the channel. Flags or filters can be added to further specify the messages, such filters would remove messages of a specific content or from a specific author.",
    permissionsBot: ["MANAGE_MESSAGES"],
    permissionsUser: [],
    channels: ["text"],
    cooldown: 1,
    usage: "purge [number] [filters]",
    examples: ["purge 5", "purge 5 @pyro"],
    enable: true,
    deleteCmd: 0,
    deleteResp: 5,
    execute(base, prefix, msg, args) {
        try {
            let man = msg.member.hasPermission("MANAGE_MESSAGES");
            let num = parseInt(args[0]);
            let user = msg.mentions.users.first();
            msg.channel.messages.fetch({
                limit: 100,
                before: msg.id
            }).then(omsg => {
                let msg_array = omsg.array();
                if (!man) msg_array = omsg.filter(m => m.author.id == msg.author.id).array();
                else if (user) msg_array = omsg.filter(m => m.author.id == user.id).array();
                msg_array.length = num;
                msg_array.map(m => m.delete().catch(console.error));
            });
            base.utils.sendEmbed(msg, `${num} messages have been deleted.`, 3447003, 3);
        } catch (err) {
            return base.utils.noArgsFound(msg, prefix, this);
        }
    }
};
