"use strict";

const Discord = require("discord.js"); //import the discord.js module
const yt = require("youtube-dl") //import the discord music module
const config = require("./config.json"); //import the config.js file
const fs = require("fs"); //import the fs module

const bot = new Discord.Client(); //create an instance of a Discord Client, and call it bot

var userToKick = 0; //saves the user that was kicked
var kickMsg = 0; //saves the kick message for the kicked user
var lastMsgID = 0; //saves the last message authors id
const editingCode = false; //state code editing in session
//-----------------------------------| Functions |-----------------------------------------
function commandIs(str, msg){
  return msg.content.toLowerCase().startsWith(config.prefix + str);
}
function clean(text) {
  if (typeof(text) === "string")
  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
  return text;
}
//------------------------------------| Main |---------------------------------------------
bot.login(config.token);//Login to bot
bot.on('error', e => { console.error(e); }); //log error to console
bot.on('warn', e => { console.warn(e); }); //log warning to console
//bot.on('debug', e => { console.debug(e): }); //log debugs to console
bot.on('disconnect', () => { console.log('Celestial has left the building!'); }); //log bot disconnected to console
bot.on('reconneting', () => { console.log('Attempting to find Celestial.'); }); //log bot reconneting to console
bot.on('ready', () => { //Display ready when bot is active
  console.log('Celestial is ready to serve!');
  let randNumber = Math.round(Math.random() * (config.games.length));
  if(editingCode) bot.user.setGame('with code');
  else bot.user.setGame(config.games[randNumber]);
});
//-----------------------------------| Member |--------------------------------------------
bot.on("guildMemberAdd", mem => { //Member joins
  if(mem.guild.id !== 267886997467693056) return; //ONLY AVALIABLE IN TEST SERVER FOR NOW
  mem.guild.channels.find("name", "welcome").sendMessage(`${mem.user} has joined the server.`);
}); //End member mod_log
bot.on("guildMemberRemove", mem => {  //Member leaves/kicked
  if(mem.guild.id !== 267886997467693056) return; //ONLY AVALIABLE IN TEST SERVER FOR NOW
  if(userToKick.username !== mem.user.username) mem.guild.channels.find("name", "mod_log").sendMessage(`${mem.user.username} has left the server.`);
  else mem.guild.channels.find("name", "mod_log").sendMessage(`${mem.user.username} has been kicked from the server.`);
}); //End member mod_log
//------------------------------| Commands & Messages |-----------------------------------
bot.on("message", msg => {//Welcome new members
  if(msg.channel.name !== "welcome") return; //if in welcome continue
  if(!msg.author.bot) return; //if a bot continue
  if(msg.author.id === 264995143789182976) return; //if not celestial continue
  let args = msg.content.split(" ").slice(1); //create arguments
  if(msg.author.username == "Celestial") return; //if not celestial continue
  let userToSay = msg.mentions.users.first(); //Store user to say
  msg.delete().catch(console.error); //delete other bots message
  msg.channel.sendMessage(userToSay + " " + args.join(" ")); //repeat message only from celetial this time
});

bot.on("message", message => {//Keep track of points only
  if(message.channel.type !== "text") return; //If in textChannel continue
  if(message.channel.name === "commands") return; //If not in command chat
  if(message.content.startsWith(config.prefix)) return; //If starts with prefix return
  if(message.author.bot) return; //If not a bot continue

  let points = JSON.parse(fs.readFileSync('./points.json', 'utf8')); //update points variable
  if(!points[message.author.id]) points[message.author.id] = {points: 0, level: 0}; //If user doesnt exist create one

  let userData = points[message.author.id]; //save points of user
  let curLevel = Math.floor(userData.points / 100); //saves current level of user

  if(message.author.id !== lastMsgID) userData.points++;//adds one point
  if(curLevel > userData.level) { //if current level is greater than users level
    userData.level = curLevel;
    message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
  }
  lastMsgID = message.author.id;
  fs.writeFile('./points.json', JSON.stringify(points), (err) => {if(err) console.error(err)});//write changes to file
});

bot.on("message", msg => { //Commands
  if(msg.channel.type !== "text") return; //If in textChannel continue
  if(!msg.content.startsWith(config.prefix)) return; //If has prefix continue
  if(msg.author.bot) return; //If not a bot continue

  let chiefRole = msg.guild.roles.find("name","Bot Chief"); //Assign Bot Chief to chiefRole
  let modRole = msg.guild.roles.find("name", "Mod"); //Assign Mod to modRole
  let adminRole = msg.guild.roles.find("name", "Admin"); //Assign Admin to adminRole
  let staffRole = msg.guild.roles.find("name", "Staff"); //Assign Staff to staffRole
  let seniorRole = msg.guild.roles.find("name", "Senior Member"); //Assign SeniorMember to seniorRole
  let args = msg.content.split(" ").slice(1); //create arguments

  if (commandIs("ping", msg)) { //Ping command
    if(msg.channel.name !== "commands") return msg.delete().catch(console.error); //limit to command chat only
    msg.channel.sendMessage("pong!"); //reply pong
  }
  else if(commandIs("help", msg) || commandIs("h", msg)) { //Help command
    if(msg.channel.name !== "commands") return msg.delete().catch(console.error); //limit to command chat only
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later."); //NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("commands", msg) || commandIs("cmds", msg)) {
    if(msg.channel.name !== "commands") return msg.delete().catch(console.error); //limit to command chat only
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later."); //NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("say", msg)) { //Say command
    if(!msg.member.roles.has(adminRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?say`."); //limit to admin only
    else if(args.length === 0) return msg.channel.sendMessage("You did not define a argument. Usage: `?say [message]`"); //check for message to say
    else{
      msg.delete().catch(console.error); //delete message from chat
      msg.channel.sendMessage(args.join(" ")); //display echoed message as bot
    }
  }
  else if(commandIs("apply", msg) || commandIs("app", msg)) {//Apply command
    if(msg.channel.name !== "commands") return msg.delete(); //limit to command chat only
    if(args.length < 2) return msg.channel.sendMessage("You did not define an argument. Usage: `?apply [role] [reason]`"); //check for role, reason
    else {
      msg.delete().catch(console.error); //delete message from chat
      let reasonFor = args.slice(1).join(" "); //set reason to arguments
      msg.guild.channels.find("name", "mod_log").sendMessage(`**${msg.author}** has applied to **${args[0]}**: ${reasonFor}`); //send embedded message
    }
  }
  else if(commandIs("erotica", msg) || commandIs("lewd", msg)) { //Erotica command
    if(msg.channel.name !== "commands") return msg.delete(); //Limit to command chat only
    if(msg.member.roles.has(restRole.id)) return msg.reply("You're too young and innocent to use this command `?Erotica`."); //check if user is restricted
    let lewdRole = msg.guild.roles.find("name", "Erotica"); //set lewd role from guild roles find name
    msg.delete().catch(console.error); //delete message from chat
    if(!msg.member.roles.has(lewdRole.id)) { //if member doesnt have erotica role
      msg.member.addRole(lewdRole).catch(console.error); //add role to author
      msg.author.sendMessage("`Erotica` role has been added to your user."); //pm message that role has been added
    } else { //if member has the erotica role
      msg.member.removeRole(lewdRole).catch(console.error); //remove role from year
      msg.author.sendMessage("`Erotica` role has been removed from your user"); //pm message that role has been removed
    }
  }
  else if(commandIs("kick", msg)) { //Kick command
    if(msg.channel.name !== "commands") return msg.delete(); //limit to command chat only
    if(!msg.member.roles.has(adminRole.id)) { //limit to admin only
      msg.guild.channels.find("name", "mod_log").sendMessage(`**${msg.author}** has attempted to use the **kick** command in ${msg.channel}: "${msg.content}"`); //reccord message to modlog
      return msg.reply("You pleb, you don't have permission to use this command `?kick`."); //insult unauthorized user
    } else if(args.length < 2) msg.channel.sendMessage("You did not define a argument. Usage: `?kick [user] [reason]`"); //check for user, and reason
    else {
      userToKick = msg.mentions.users.first(); //set user to kick
      let kickMsg = args.slice(1).join(" "); //set reason to arguments minus user
      msg.guild.member(userToKick).kick(); //kick the mentioned user
      msg.delete().catch(console.error); //delete message from chat
      msg.guild.members.get(userToKick.id).sendMessage(`You have been kicked from **${msg.guild.name}**. For the following reason: ${kickMsg}`); //send pm to user with reason
      msg.guild.channels.find("name", "mod_log").sendMessage(`**${msg.author}** has kicked **${userToKick}** for the following reason: **${kickMsg}**`); //send embed message to modlog
    }
  }
  else if(commandIs("ban", msg)) { //Ban command
    if(msg.channel.name !== "commands") return msg.delete(); //limit to command chat only
    if(!msg.member.roles.has(adminRole.id)) { //limit to admin only
      msg.guild.channels.find("name", "mod_log").sendMessage(`**${msg.author}** has attempted to use the **ban** command in ${msg.channel}: "${msg.content}"`); //record message to modlog
      return msg.reply("You pleb, you don't have permission to use this command `?ban`."); //insult unauthorized user
    } else if(args.length < 2) msg.channel.sendMessage("You did not define a argument. Usage: `?ban [user] [reason]`"); //check for user, and reason
    else {
      let userToBan = msg.mentions.users.first(); //set user to ban
      let banMsg = args.slice(1).join(" "); //set reason to arguments minus user
      msg.guild.member(userToBan).ban(); //ban the mentioned user
      msg.delete().catch(console.error); //delete message from chat
      msg.guild.members.get(userToBan.id).sendMessage(`You have been banned from **${msg.guild.name}**. For the following reason: ${banMsg}`); //send pm to user with reason
      msg.guild.channels.find("name", "mod_log").sendMessage(`**${msg.author}** has banned **${userToBan}** for the following reason: **${banMsg}**`); //send embed message to modlog
    }
  }
  else if(commandIs("warn", msg)) { //Warn command
    if(msg.channel.name !== "commands") return msg.delete(); //limit to command chat only
    if(!msg.member.roles.has(staffRole.id)) { //limit to staff only
      msg.guild.channels.find("name", "mod_log").sendMessage(`**${msg.author}** has attempted to use the **warn** command in ${msg.channel}: "${msg.content}"`); //record message to modlog
      return msg.reply("You pleb, you don't have permission to use this command `?warn`."); //insult unauthorized user
    } else if(args.length < 2) msg.channel.sendMessage("You did not define a argument. Usage: `?warn [user] [message]`"); //check for user, and reason
    else {
      let userToWarn = msg.mentions.users.first(); //set user to warn
      let warnMsg = args.slice(1).join(" "); //set reason to arguments minus user
      msg.delete().catch(console.error); //delete message from chat
      msg.guild.members.get(userToWarn.id).sendMessage(`You have been warned from **${msg.guild.name}**. For the following reason: ${warnMsg}`); //send pm to user with reason
      msg.guild.channels.find("name", "mod_log").sendMessage(`**${msg.author}** has warned **${userToWarn}** for the following reason: **${warnMsg}**`); //send embed message to modlog
    }
  }
  else if(commandIs("prune", msg) || commandIs("pruge", msg)) { //Prune|Purge command
    if(msg.member.roles.has(adminRole.id)) var mdLimit = 100; //limit to admin only
    else if(msg.member.roles.has(modRole.id)) var mdLimit = 20; //limit to mod only
    else return msg.reply("You pleb, you don't have permission to use this command `?purge | ?prune`."); //insult unauthorized user
    if(args.length === 0) return msg.channel.sendMessage("You did not define a argument. Usage: `?prune [number]`"); //check for message count
    let messagecount = parseInt(args[0]); //fetch the number of messages to prune
    msg.channel.fetchMessages({limit: mdLimit}).then(msg => { // get the channel logs
      let msg_array = msg.array(); //create an array for messages
      msg_array.length = messagecount + 1;//limit to the requested number + 1 for the command message
      msg_array.map(m => m.delete().catch(console.error));//has to delete messages individually.
    });
  }
  else if(commandIs("prisolis", msg)) { //Prisolis command
    if(msg.channel.name !== "commands") return msg.delete();
    if(msg.member.roles.has(modRole.id) || msg.member.roles.has(adminRole.id)) {
      if(!msg.guild.channels.find("name", "Story Time w/ Mr.Z")){
        msg.guild.createChannel("Story Time w/ Mr.Z", "voice", [
          {'id': '212630495098437633', 'type': 'role', 'deny': 0, 'allow': 871366673},
          {'id': '212624757818916864', 'type': 'role', 'deny': 838860816, 'allow': 3145729},
          {'id': '222883669377810434', 'type': 'member', 'deny': 536870928, 'allow': 334495745}
        ]);
        msg.channel.sendMessage("Voice channel named `Story Time w/ Mr.Z` has been created. Use `?prisolis` to delete the channel after use.");
      }
      else {
        msg.guild.channels.find("name", "Story Time w/ Mr.Z").delete();
        msg.channel.sendMessage("Voice channel named `Story Time w/ Mr.Z` has been deleted.")
      }
    }
    else return msg.reply("You pleb, you don't have permission to use this command `?prisolis`.");
  }
  else if(commandIs("rename", msg)) { //Rename command
    if(msg.channel.name !== "commands") return msg.delete();
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later.");//NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("level", msg) || commandIs("points", msg)) { //Level command
    if(msg.channel.name !== "commands") return msg.delete(); //limit to command chat only
    let points = JSON.parse(fs.readFileSync('./points.json', 'utf8')); //update points variable
    let userPoints = points[msg.author.id] ? points[msg.author.id].points : 0; // //set points to author points
    let curLevel = points[msg.author.id] ? points[msg.author.id].level : 0; //set level to author level
    msg.reply(`You are currently level ${curLevel}, with ${userPoints} points.`); //send level and points to chat
  }
  else if(commandIs("info", msg)) { //Info command
    if(msg.channel.name !== "commands") return msg.delete();
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later.");//NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("status", msg) || commandIs("stat", msg)) { //Status command
    if(msg.channel.name !== "commands") return msg.delete();
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later.");//NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("top", msg) || commandIs("top10", msg)) { //Top command
    if(msg.channel.name !== "commands") return msg.delete();
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later.");//NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("choose", msg)) { //Choose command
    if(msg.channel.name !== "commands") return msg.delete();
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later.");//NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("coinflip", msg) || commandIs("coin", msg) || commandIs("flip", msg) || commandIs("cointoss", msg)) { //Coinflip command
    if(msg.channel.name !== "commands") return msg.delete();
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later.");//NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("roles", msg)) { //Roles command
    if(msg.channel.name !== "commands") return msg.delete();
    return msg.channel.sendMessage("This command is still being worked on, and not yet available. Please check back later.");//NOT AVAILABLE AT THIS MOMENT
  }
  else if(commandIs("test", msg)){ //Test command
    if(msg.channel.name !== "commands") return msg.delete().catch(console.error); //limit to command chat only
    msg.delete();
  }
  else if(commandIs("permission", msg)){
    if(msg.channel.name !== "commands") return msg.delete();
    if(!msg.member.roles.has(adminRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?permission`.");
    var pCollection = 0;
    if(args[0] === "channels") {
      if(!msg.guild.channels.get(args[1])) return msg.channel.sendMessage(`${args[1]} does not exist`)
      pCollection = msg.guild.channels.get(args[1]).permissionOverwrites;
      console.log(pCollection);
      msg.delete();
    }
    else return msg.channel.sendMessage("You did not define a argument. Usage: `?permission [type] [channelID]`"); //check for message count
  }
  else {
    return;
  }
}); //End Commands

bot.on("message", msg => {//Private Messages
  if(msg.channel.type !== "dm") return; //If DM continue
  if(msg.author.bot) return; //If not bot continue
  console.log(msg.author.username + ": " + msg.content); //Log messages sent to bot
  /*Default message*/ msg.channel.sendMessage(`Hello, my name is **Celestial**! I am __**${config.server_name}**__ server's personal bot! https://discord.gg/c87vWSM`); //For everyone else
}); //End Private Messages
