"use strict";

const Discord = require("discord.js"); //import the discord.js module
const bot = new Discord.Client(); //create an instance of a Discord Client, and call it bot

// const CleverBot = require("cleverbot-node");
// const cleverBot = new CleverBot();

const auth = require("./auth.json"); // import the authorzation file
const config = require("./config/config.json"); // import the config file

const utils = require("./modules/utility.js");
const fun = require("./modules/fun.js");
const basic = require("./modules/basic.js");
const setup = require("./modules/config.js");
const manage = require("./modules/management.js");

var usersRemoved = [];
const editingCode = true;

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
});

bot.on("message", msg => { //Scan messages in text channels
  var PREFIX = auth.prefix;
  if(msg.channel.type != 'text') return; //If messages is in text channel continue
  else if(msg.content.startsWith(PREFIX + " ")) return; //If starts with prefix then space return
  else if(!msg.content.startsWith(PREFIX)) return; //If has prefix continue
  else if(msg.author.bot) return; //If not a bot continue

  let cmd = msg.content.substr(1).split(" ")[0];

  switch(cmd){
    //text chat
    case 'apply':
    case 'app':
    basic.applyRole(PREFIX, msg);
    break;

    //text chat
    case 'ban':
    usersRemoved = manage.banMembers(PREFIX, msg, bot, usersRemoved);
    break;

    //text chat
    case 'choose':
    case 'pick':
    fun.choose(PREFIX, msg);
    break;

    //text chat
    case 'coin':
    case 'flip':
    case 'coinflip':
    case 'cointoss':
    fun.coinFlip(PREFIX, msg);
    break;

    //any chat
    case 'commands':
    case 'cmds':
    utils.commands(PREFIX, msg);
    break;

    //text chat
    case 'giveaway':
    basic.giveaway(PREFIX, msg);
    break;

    //any chat
    case 'help':
    case 'h':
    utils.help(PREFIX, msg);
    break;

    //any chat
    case 'info':
    case 'i':
    case '411':
    utils.information(PREFIX, msg);
    break;

    //any chat
    case 'invite':
    case 'inv':
    utils.invite(PREFIX, msg, bot, config, auth);
    break;

    //text chat
    case 'kick':
    usersRemoved = manage.kickMembers(PREFIX, msg, bot, usersRemoved);
    break;

    //text chat
    case 'letsplay':
    case 'lp':
    fun.letsplay(PREFIX, msg);
    break;

    //text chat
    case 'move':
    case 'm':
    manage.moveMembers(PREFIX, msg, bot);
    break;

    //any chat
    case 'ping':
    utils.ping(PREFIX, msg, bot);
    break;

    //text chat (my guilds only)
    case 'prisolis':
    fun.prisolis(PREFIX, msg);
    break;

    //text chat
    case 'prune':
    manage.prune(PREIFX, msg, bot);
    break;

    //text chat
    case 'purge':
    utils.purge(PREFIX, msg, bot);
    break;

    //text chat
    case 'reverse':
    fun.reverseMessage(PREFIX, msg);
    break;

    //text chat
    case 'roll':
    case 'rolldice':
    case 'dice':
    fun.rolldice(PREFIX, msg);
    break;

    // text chat
    case "rps":
    fun.rps(PREFIX, msg);
    break;

    //text chat
    case 'say':
    case 'speak':
    utils.say(PREFIX, msg);
    break;

    //any chat
    case 'set':
    setup.setBot(PREFIX, msg);
    break;

    //text chat
    case 'softban':
    usersRemoved = manage.softBanMembers(PREFIX, msg, bot);
    break;

    //any chat
    case 'status':
    setup.statusBot(PREFIX, msg);
    break;

    //any chat
    case 'suggestion':
    utils.makeSuggestion(PREFIX, msg, bot);
    break;

    //text chat
    case 'tabletop':
    case 'tt':
    fun.tabletop(PREFIX, msg);
    break;

    //text chat
    case 'warn':
    manage.warnMembers(PREFIX, msg);
    break;
  }
});

bot.on("message", msg => {
  var PREFIX = auth.prefix;
  if(msg.channel.type != 'dm') return; //If messages is in text channel continue
  else if(msg.author.bot) return; //If not a bot continue

  var command = [];
  command.push(msg.content.substr(1).split(/ +/g)[0]);
  command.push(msg.content.split(/ +/g)[0]);

  command.map(cmd => {
    switch(cmd){
      //dm chat
      case 'clean':
      utils.cleanMessages(PREFIX, msg, bot);
      break;

      //any chat
      case 'commands':
      case 'cmds':
      utils.commands(PREFIX, msg);
      break;

      //dm chat
      case 'eval':
      case 'e':
      setup.evalcmd(PREFIX, msg, bot);
      break;

      //any chat
      case 'help':
      case 'h':
      utils.help(PREFIX, msg);
      break;

      //any chat
      case 'info':
      case 'i':
      case '411':
      utils.information(PREFIX, msg, bot);
      break;

      //any chat
      case 'invite':
      case 'inv':
      utils.invite(PREFIX, msg, bot, config, auth);
      break;

      //any chat
      case 'ping':
      utils.ping(PREFIX, msg, bot);
      break;

      //any chat
      case 'set':
      setup.setBot(PREFIX, msg);
      break;

      //any chat
      case 'status':
      setup.statusBot(PREFIX, msg);
      break;

      //any chat
      case 'suggestion':
      utils.makeSuggestion(PREFIX, msg, bot, config);
      break;
    }
  });
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
