"use strict";

const Discord = require("discord.js"); //import the discord.js module
const bot = new Discord.Client(); //create an instance of a Discord Client, and call it bot

// const CleverBot = require("cleverbot-node");
// const cleverBot = new CleverBot();

const auth = require("./auth.json"); // import the authorzation file
const config = require("./config/config.json"); // import the config file

import * as utility from '/modules/utility';
import * as fun from '/modules/fun';
import * as music from '/modules/music';
import * as basic from '/modules/basic';
import * as management from '/modules/management';

var usersRemoved = [];
const editingCode = true;
const PREFIX = '?';

bot.login(auth.token);//Login to bot
bot.on('error', e => { console.error(e); }); //log error to console
bot.on('warn', e => { console.warn(e); }); //log warning to console
//bot.on('debug', e => { console.debug(e); }); //log debugs to console
bot.on('disconnect', () => { console.log('Celestial has left the building!'); }); //log bot disconnected to console
bot.on('reconneting', () => { console.log('Attempting to find Celestial.'); }); //log bot reconneting to console
bot.on('ready', () => { //Display ready when bot is active
  console.log('Celestial is ready to serve!');
  if(editingCode) {
    bot.user.setGame('with code');
  } else {
    let randNumber = Math.floor(Math.random() * auth.messages.length);
    bot.user.setGame(auth.messages[randNumber]);
  }
);

bot.on("message", msg => { //Scan messages in text channels
  var PREFIX = auth.prefix;
  if(msg.channel.type != 'text') return; //If messages is in text channel continue
  if(msg.content.startsWith(PREFIX + " ")) return; //If starts with prefix then space return
  else if(!msg.content.startsWith(PREFIX)) return; //If has prefix continue
  else if(msg.author.bot) return; //If not a bot continue

  let cmd = msg.content.substr(1).split(" ")[0];

  switch(cmd){
    //text chat
    case 'apply':
    case 'app':
    applyRole(PREFIX, msg);
    break;

    //text chat
    case 'ban':
    usersRemoved = banMembers(PREFIX, msg, bot, usersRemoved);
    break;

    //text chat
    case 'choose':
    case 'pick':
    choose(PREFIX, msg);
    break;

    //text chat
    case 'coin':
    case 'flip':
    case 'coinflip':
    case 'cointoss':
    coinFlip(PREFIX, msg);
    break;

    //any chat
    case 'commands':
    case 'cmds':
    commands(PREFIX, msg);
    break;

    //text chat
    case 'giveaway':
    giveaway(PREFIX, msg);
    break;

    //any chat
    case 'help':
    case 'h':
    help(PREFIX, msg);
    break;

    //any chat
    case 'info':
    case 'i':
    case '411':
    information(PREFIX, msg);
    break;

    //any chat
    case 'invite':
    case 'inv':
    invite(PREFIX, msg);
    break;

    //text chat
    case 'kick':
    usersRemoved = kickMembers(PREFIX, msg, bot, usersRemoved);
    break;

    //text chat
    case 'letsplay':
    case 'lp':
    letsplay(PREFIX, msg);
    break;

    //text chat
    case 'move':
    case 'm':
    moveMembers(PREFIX, msg, bot);
    break;

    //any chat
    case 'ping':
    ping(PREFIX, msg);
    break;

    //text chat (my guilds only)
    case 'prisolis':
    prisolis(PREFIX, msg);
    break;

    //text chat
    case 'prune':
    prune(PREIFX, msg);
    break;

    //text chat
    case 'purge':
    purge(PREFIX, msg);
    break;

    //text chat
    case 'reverse':
    reverseMessage(PREFIX, msg);
    break;

    //text chat
    case 'roll':
    case 'rolldice':
    case 'dice':
    rolldice(PREFIX, msg);
    break;

    // text chat
    case "rps":
    rps(PREFIX, msg);
    break;

    //text chat
    case 'say':
    case 'speak':
    say(PREFIX, msg);
    break;

    //any chat
    case 'set':
    setBot(PREFIX, msg);
    break;

    //text chat
    case 'softban':
    usersRemoved = softBanMembers(PREFIX, msg, bot);
    break;

    //any chat
    case 'status':
    statusBot(PREFIX, msg);
    break;

    //any chat
    case 'suggestion':
    makeSuggestion(PREFIX, msg);
    break;

    //text chat
    case 'tabletop':
    case 'tt':
    tabletop(PREFIX, msg);
    break;

    //text chat
    case 'warn':
    warnMembers(PREFIX, msg);
    break;
  }
  addMessageLog(msg);
});

bot.on("message", msg => {
  var PREFIX = auth.prefix;
  if(msg.channel.type != 'dm') return; //If messages is in text channel continue
  else if(msg.author.bot) return; //If not a bot continue

  var cmd = msg.content.substr(1).split(" ")[0];
  var once = 0;

  [lbl] checkMsg:
  switch(cmd){
    //dm chat
    case 'clean':
    cleanMessages(PREFIX, msg);
    goto checkDone;

    //any chat
    case 'commands':
    case 'cmds':
    commands(PREFIX, msg);
    goto checkDone;

    //dm chat
    case 'eval':
    case 'e':
    evalcmd(PREFIX);
    goTo checkDone;

    //any chat
    case 'help':
    case 'h':
    help(PREFIX, msg);
    goto checkDone;

    //any chat
    case 'info':
    case 'i':
    case '411':
    information(PREFIX, msg);
    goto checkDone;

    //any chat
    case 'invite':
    case 'inv':
    invite(PREFIX, msg);
    goto checkDone;

    //any chat
    case 'ping':
    ping(PREFIX, msg);
    goto checkDone;

    //any chat
    case 'set':
    setBot(PREFIX, msg);
    goto checkDone;

    //any chat
    case 'status':
    statusBot(PREFIX, msg);
    goto checkDone;

    //any chat
    case 'suggestion':
    makeSuggestion(PREFIX, msg);
    goto checkDone;

    default:
    if(!once){
      once++;
      cmd = msg.content.split(" ")[0];
      goto checkMsg;
    }
  }
  [lbl] checkDone:
});

bot.on("guildMemberAdd", mem => { //Member joins guils
  let guild =  mem.guild;
  memberAdded(mem, guild);
});

bot.on("guildMemberRemove", mem => { //Member leaves/kicked
  let guild =  mem.guild;
  memberRemoved(mem, guild, usersRemoved);
});

bot.on("guildBanAdd", (guild, mem) => { //Member Banned
  memberBanned(mem, guild, usersRemoved);
});

/*
bot.on("guildBanRemove", (guild, mem) => { //Member Unbanned
  memberUnbanned(mem, guild);
});
*/

bot.on("guildCreate", guild => { //Client joins a new guild
  console.log(`New guild added: ${guild}.`);
});

bot.on("guildDelete", guild => { //CLient leaves guild or guild is deleted
  console.log(`Old guild left/deleted: ${guild}.`);
});

bot.on("guildMembersChunk", (mem, guild) => { //Members joins guild
  mem.map(m => memberAdded(m, guild));
});

bot.on("guildMemberUpdate", (oldMem, newMem) => { //Member updates info
  memberUpdated(oldMem, newMem);
});

bot.on("guildUpdate", (oldGuild, newGuild) => { //Guild updates info
  console.log(`${oldGuild.name} has changed the name to ${newGuild.name}.`);
});

/*
bot.on("presenceUpdate", (oldMem, newMem) => { //Member updates presence
  console.log(`${oldMem.username}`)
});
*/

bot.on("userUpdate", (oldMem, newMem) => { //Member updats info
  memberUpdated(oldMem, newMem);
});
