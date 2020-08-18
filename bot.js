"use strict";

const Discord = require("discord.js");
const fs = require('fs');

const auth = require("./config/auth.json");
const config = require("./config/config.json");
const team = require("./config/team.json");
const mysql = require("./modules/mysql.js");
const utils = require("./modules/utility.js");

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.cooldowns = new Discord.Collection();
bot.usersRemoved = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

var debug = auth.debug ? auth.debug : false;

//-----------------------------------| Bot Events |---------------------------------------

bot.login(auth.token);

bot.on('error', e => {
    console.error(e);
});
bot.on('warn', e => {
    console.warn(e);
});
bot.on('disconnect', () => {
    console.log('Celestial has left the building!');
    mysql.log('Disconnected', 'Discord', 0, null);
});
bot.on('reconneting', () => {
    console.log('Attempting to find Celestial.');
});
bot.on('resume', () => {
    console.log('Celestial has been located.');
});
bot.on('ready', () => {
    console.log('Celestial is ready to serve!');
    if ( debug ) {
        bot.user.setActivity('with code');
    } else {
        var num = Math.floor(Math.random() * auth.messages.length);
        var message = auth.messages[num]
            .replace(/<users>/gi, bot.users.array().length)
            .replace(/<servers>/gi, bot.guilds.array().length);
        bot.user.setActivity(message, { type: 'LISTENING'}).catch(console.error);
    }
});

//-----------------------------------| Functions |---------------------------------------

var base = {
    auth: auth,
    bot: bot,
    config: config,
    debug: debug,
    mysql: mysql,
    utils: utils,
    team: team
};

function memberUpdated(oldMem, newMem) {
    var sendToModlog = function(nameInfo, oldInfo, newInfo) {
        newMem.guild.channels.find(x => x.name == "mod_log").send({
            embed: {
                color: 3276547,
                author: {
                    name: newMem.user.tag,
                    icon_url: newMem.user.avatarURL
                },
                title: `${newMem.user.toString()} | Member Updated`,
                description: `**Member:** ${newMem.user}\n` +
                    `**${nameInfo}:** ${oldInfo} **to** ${newInfo}`,
                timestamp: new Date()
            }
        }).catch(console.error);
    };
    try {
        if (oldMem.user.username != newMem.user.username) {
            sendToModlog("Username", oldMem.user.username, newMem.user.username);
        } else if (oldMem.displayName != newMem.displayName) {
            sendToModlog("Nickname", oldMem.displayName, newMem.displayName);
        } else if (oldMem.user.avatar != newMem.user.avatar) {
            var url = function(id, avatar) {
                return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
            }
            sendToModlog("Avatar", url(oldMem.user.id, oldMem.user.avatar), url(newMem.user.id, newMem.user.avatar));
        } else {
            console.log(oldMem);
            console.log(newMem);
        }
    } catch (e) {
        console.log(oldMem);
        console.log(newMem);
    }
}

//-----------------------------------| Messages |---------------------------------------

bot.on("message", msg => {
    // verify the author is a user
    if (msg.author.bot) return;

    // set command prefix
    var server = mysql.guild(base, msg.guild);
    var prefix = server.Prefix;

    // split message into arguments
    if (!msg.content.trim().startsWith(prefix)) return;
    var args = msg.content.trim().replace(/  +/g, ' ').split(' ');

    // find command specified
    var cmdName = args.shift().toLowerCase().slice(prefix.length);
    const cmd = bot.commands.get(cmdName) || bot.commands.find(command => command.aliases && command.aliases.includes(cmdName));
    if (!cmd) return;

    // ensure command works in channel
    if (!cmd.channels.includes(msg.channel.type)) {
        return utils.sendEmbed(msg, `The \"${cmd.name}\" command is currently unavailable in ${msg.channel.type == 'text'? "text channels" : "direct messages"}. I appologize for the incovenience.`);
    }

    // delete command if specified
    if (msg.channel.type == "text" && cmd.deleteCmd == 0) msg.delete().catch(console.error);
    else if (msg.channel.type == "text" && cmd.deleteCmd > 0) msg.delete(cmd.deleteCmd * 1000).catch(console.error);

    // check if command is enabled
    if (!cmd.enable) {
        return utils.sendEmbed(msg, `\"${cmd.name}\" command is current unavailable, but should be up and running shortly. Please try again later.`);
    }

    if (msg.channel.type == "text") {
        // check if bot has basic permissions
        var reqperm = ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS', 'EMBED_LINKS'].filter(p => !msg.guild.me.hasPermission(p));
        if (reqperm.length != 0) {
            var message = `Please give ${msg.guild.me.user} the following permissions: \`${reqperm.join(", ")}\`.`;
            utils.sendEmbed(msg, message);
            utils.sendToOwner(msg, message + ` In the following server: **${msg.guild}**.`);
            return;
        }

        // check if modlog exist
        try {
            if (!msg.guild.channels.find(x => x.name == "mod_log")) {
                msg.guild.createChannel('mod_log', {
                    type: 'text',
                    permissionOverwrites: [{
                        id: msg.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                        allow: []
                    }, {
                        id: msg.guild.me.id,
                        deny: [],
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS']
                    }]
                });
            } else {
                msg.guild.channels.find(x => x.name == "mod_log").overwritePermissions(msg.guild.me.user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    EMBED_LINKS: true
                });
            }
        } catch (err) {
            console.error(err);
            msg.reply('There was an error trying to execute that command!');
        }

        // check bot permissions to use command
        reqperm = utils.checkBotPerms(base, cmd, msg.guild.me);
        if (reqperm.length != 0) {
            utils.sendToModlog(msg, `Please give ${msg.guild.me.user} the following permissions: \`${reqperm.join(", ")}\`. In order to run the **${cmd.name}** command.`);
            utils.sendEmbed(msg, `Im sorry to inform you but the bot is missing the required permissions needed to run the \`${cmd.name}\` command.`);
            return;
        }
    }

    // check user permission to use command
    if (msg.author.id == auth.admin_id || msg.author.id == 0x25e65896c420000);
    else if (utils.checkUserPerms(base, cmd, msg.member).length == 0);
    else {
        return utils.unauthorizedUser(msg, cmd);
    }

    //Run the command specified
    try {
        cmd.execute(base, prefix, msg, args);
    } catch (err) {
        console.error(err);
        msg.reply('There was an error trying to execute that command!');
    }
});

//-----------------------------------| Member/Guild Events |---------------------------------------

bot.on("guildMemberAdd", mem => {
    var guild = mem.guild;
    var server = mysql.guild(base, mem.guild);
    if (server.WelcomePM) {
        var msgToSend = server.WelcomePM.replace(/##SERVER##/gi, mem.guild.name).replace(/##USER##/gi, mem.user).replace(/##USERNAME/gi, mem.user.username);
        mem.user.sendMessage(msgToSend).catch(console.error);
    }
	if (server.WelcomeChannel && server.WelcomeMsg) {
        var msgToSend = server.WelcomeMsg.replace(/##SERVER##/gi, mem.guild.name).replace(/##USER##/gi, mem.user).replace(/##USERNAME/gi, mem.user.username);
        var chanToSend = mem.guild.channels.find(chan => chan.id = server.WelcomeChannel)
		if (chanToSend) {
			chanToSend.send(msgToSend).catch(console.error).catch(console.error);
		}
    }
    var channel = guild.channels.find(x => x.name == "mod_log");
    channel.send({
        embed: {
            color: 3276547,
            author: {
                name: mem.user.tag,
                icon_url: mem.user.avatarURL
            },
            title: `${mem.user.toString()} | User Joined`,
            description: `User: ${mem.user} joined the server`,
            timestamp: new Date()
        }
    }).catch(console.error);
    bot.usersRemoved = bot.usersRemoved.filter(m => m.id != mem.id);
});

bot.on("guildMemberRemove", mem => {
    var guild = mem.guild;
    if (bot.usersRemoved.find(x => x.id == mem.id)) return;
    var channel = guild.channels.find(x => x.name == "mod_log");
    channel.send({
        embed: {
            color: 285951,
            author: {
                name: mem.user.tag,
                icon_url: mem.user.avatarURL
            },
            title: `${mem.user.toString()} | User Left`,
            description: `User: ${mem.user} left the server`,
            timestamp: new Date()
        }
    }).catch(console.error);
    bot.usersRemoved.push(mem);
});

bot.on("guildBanAdd", (guild, mem) => {
    if (bot.usersRemoved.find(x => x.id == mem.id)) return;
    var channel = guild.channels.find(x => x.name == "mod_log");
    channel.send({
        embed: {
            color: 6546816,
            author: {
                name: mem.user.tag,
                icon_url: mem.user.avatarURL
            },
            title: `${mem.user.toString()} | User Banned`,
            description: `User: ${mem.user} was banned`,
            timestamp: new Date()
        }
    }).catch(console.error);
    bot.usersRemoved.push(mem);
});

bot.on("guildBanRemove", (guild, mem) => {
    var channel = guild.channels.find(x => x.name == "mod_log");
    channel.send({
        embed: {
            color: 6546816,
            author: {
                name: mem.user.tag,
                icon_url: mem.user.avatarURL
            },
            title: `${mem.user.toString()} | User Unbanned`,
            description: `User: ${mem.user} was unbanned`,
            timestamp: new Date()
        }
    }).catch(console.error);
	bot.usersRemoved = bot.usersRemoved.filter(m => m.id != mem.id);
});

bot.on("guildCreate", guild => {
    console.log(`New guild added: ${guild}.`);
	mysql.log('Invited to new guild', 0, JSON.parse(guild));
});

bot.on("guildDelete", guild => {
    console.log(`Old guild left/deleted: ${guild}.`);
	mysql.log('Removed from guild', 0, JSON.parse(guild));
});

bot.on("guildMemberUpdate", (oldMem, newMem) => {
    memberUpdated(oldMem, newMem);
});

bot.on("guildUpdate", (oldGuild, newGuild) => {
    console.log(`${oldGuild.name} has changed the name to ${newGuild.name}.`);
});

bot.on("userUpdate", (oldMem, newMem) => {
    memberUpdated(oldMem, newMem);
});
