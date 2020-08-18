"use strict";

exports.deleteAfterTime = (msg, timer, num) => {
    msg.channel.fetchMessages({
        limit: num
    }).then(msg => { // get the channel logs
        let msg_array = msg.array(); //create an array for messages
        msg_array.length = num; //limit to the requested number + 1 for the command message
        msg_array.map(m => m.delete(timer * 1000).catch(console.error)); //has to delete messages individually.
    });
};

exports.getCommand = (cmds, cmdName) => {
    let commands = cmds.filter(cmd => {
        return cmd.alias.filter(p => p.trim().toLowerCase() == cmdName.trim().toLowerCase()).length > 0;
    });
    return commands[0];
};

exports.clean = (text) => {
    if (typeof(text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
};

exports.createInvite = (base, guild) => {
    let invite = guild.channels[0].createInvite().catch(console.error);
    return invite;
}

exports.sendToModlog = (msg, message) => {
    return msg.guild.channels.find(x => x.name == "mod_log").send({
        embed: {
            color: 3447003,
            description: message
        }
    }).catch(console.error);
};

exports.sendActionToModlog = (msg, action, color, user, message) => {
    try {
        msg.guild.channels.find(c => c.name == "mod_log").send({
            embed: {
                color: color,
                author: {
                    name: user.username,
                    icon_url: user.avatarURL
                },
                title: `User ${action}`,
                description: `${msg.author} has ${action.toLowerCase()} ${user}`,
                fields: [{
                    name: `Reason`,
                    value: message
                }],
                timestamp: new Date()
            }
        });
    } catch (e) {
        console.log(e);
    }
}

exports.sendActionToDM = (msg, action, color, user, message) => {
    let man = msg.member.hasPermission("ADMINISTRATOR") ? "an Admin" : "a Mod";
    try {
        msg.guild.member(user).send({
            embed: {
                color: color,
                author: {
                    name: msg.guild.name,
                    icon_url: msg.guild.iconURL
                },
                title: `User ${action}`,
                description: `You have been ${action.toLowerCase()} by ${man}`,
                fields: [{
                    name: 'Reason',
                    value: message
                }],
                timestamp: new Date()
            }
        });
    } catch (e) {
        console.log(e);
    }
}

exports.sendEmbed = (msg, message) => {
    return msg.channel.send({
        embed: {
            color: 3447003,
            description: message
        }
    }).catch(console.error);
};

exports.sendEmbed = (msg, message, timer) => {
    msg.channel.send({
        embed: {
            color: 3447003,
            description: message
        }
    }).then(msgs => {
        if (timer && timer > 0) {
            msgs.delete(timer * 1000);
        }
    }).catch(console.error);
};

exports.sendEmbed = (msg, message, timer, color) => {
    msg.channel.send({
        embed: {
            color: color || 3447003,
            description: message
        }
    }).then(msgs => {
        if (timer && timer > 0) {
            msgs.delete(timer * 1000);
        }
    }).catch(console.error);
};

exports.sendToOwner = (msg, message) => {
    return msg.guild.owner.send({
        embed: {
            color: 3447003,
            description: message
        }
    }).catch(console.error);
};

exports.noArgsFound = (msg, prefix, cmd) => {
    return this.sendEmbed(msg, `You did not define an argument. Usage: \`${prefix + cmd.usage}\``, cmd.deleteResp);
};

exports.noArgsFound = (msg, prefix, cmd, timer) => {
    return this.sendEmbed(msg, `You did not define an argument. Usage: \`${prefix + cmd.usage}\``, timer);
};

exports.noArgsFound = (msg, prefix, cmd, timer, color) => {
    return this.sendEmbed(msg, `You did not define an argument. Usage: \`${prefix + cmd.usage}\``, timer, color);
};

exports.unauthorizedUser = (msg, cmd) => {
    return this.sendEmbed(msg, `Im sorry to inform you but you are missing one or more of the requried permissions needed to run this command: \`${cmd.name}\`.`, cmd.deleteResp);
};

exports.checkBotPerms = (base, cmd, bot) => {
    if (cmd.permissionsBot.length == 0) return [];
    let perms = cmd.permissionsBot.filter(p => {
        return !bot.hasPermission(p);
    });
    return perms;
};

exports.checkUserPerms = (base, cmd, member) => {
    if (cmd.permissionsUser.length == 0) return [];
    let perms = cmd.permissionsUser.filter(p => {
        try {
            return !member.hasPermission(p);
        } catch (e) {
            return true;
        }
    });
    return perms;
};

exports.sample = (array) => {
    let length = array.length;
    let index = Math.floor(Math.random() * length);
    if( index >= length ) index = length - 1;
    return array[index];
}
