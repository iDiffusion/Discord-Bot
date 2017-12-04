"use strict";

const Discord = require("discord.js"); //import the discord.js module
const bot = new Discord.Client(); //create an instance of a Discord Client, and call it bot

const config = require("./config.json"); // import the config file

// const CleverBot = require("cleverbot-node");
// const cleverBot = new CleverBot();

const editingCode = true; //state code editing in session
var userRemoved = 0; //saves the user that was removed
//-------------------------------------| Function |-----------------------------------------
function clean(text) {
  if (typeof(text) === "string")
  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
  return text;
}
function deleteAfterTime(msg, timer, num){
  msg.channel.fetchMessages({limit: num}).then(msg => { // get the channel logs
    let msg_array = msg.array(); //create an array for messages
    msg_array.length = num;//limit to the requested number + 1 for the command message
    msg_array.map(m => m.delete(timer).catch(console.error));//has to delete messages individually.
  });
}
function information(msg, commmand, description, category, permission, example, alias){
  msg.channel.sendEmbed({
    color: 3447003,
    author: {
      name: msg.guild.name,
      icon_url: msg.guild.iconURL
    },
    title: `${commmand} command`,
    description: description,
    fields: [{
      name:'Category',
      value: category
    },{
      name:'Permission',
      value: permission
    },{
      name: 'Example',
      value: example
    },{
      name: 'Alias',
      value: alias
    }],
    timestamp: new Date()
  });
}
//------------------------------------| Main |---------------------------------------------
bot.login(config.token);//Login to bot
bot.on('error', e => { console.error(e); }); //log error to console
bot.on('warn', e => { console.warn(e); }); //log warning to console
//bot.on('debug', e => { console.debug(e); }); //log debugs to console
bot.on('disconnect', () => { console.log('Celestial has left the building!'); }); //log bot disconnected to console
bot.on('reconneting', () => { console.log('Attempting to find Celestial.'); }); //log bot reconneting to console
bot.on('ready', () => { //Display ready when bot is active
  console.log('Celestial is ready to serve!');
  let randNumber = Math.round(Math.random() * (config.games.length - 1));
  if(editingCode) bot.user.setGame('with code');
  else bot.user.setGame(config.games[randNumber]);
});
//-----------------------------------| Member |--------------------------------------------
bot.on("guildMemberAdd", mem => { //Member joins
  let user = mem.guild.member(mem.id);
  let msgToSend = config.welcome_msg.replace(/-mention/gi, mem.user);
  mem.guild.channels.find("name", "general").sendMessage(msgToSend);
  msgToSend = config.welcome_pm.replace(/-server/gi, mem.guild.name).replace(/#information/gi, mem.guild.channels.find("name", "information"));
  mem.sendMessage(msgToSend);
  mem.guild.channels.find("name", "mod_log").sendEmbed({
    color: 3276547,
    author: {
      name: mem.displayName + "#" + user.user.discriminator,
      icon_url: user.user.avatarURL
    },
    title: `${mem.user.toString()} | User Joined`,
    description: `User: ${mem.user} joined the server`,
    timestamp: new Date()
  });
});
bot.on("guildMemberRemove", mem => {  //Member leaves/kicked
  if(mem.id == userRemoved.id) return;
  mem.guild.channels.find("name", "mod_log").sendEmbed({
    color: 285951,
    author: {
      name: mem.displayName + "#" + mem.user.discriminator,
      icon_url: mem.user.avatarURL
    },
    title: `${mem.user.toString()} | User Left`,
    description: `User: ${mem.user} left the server`,
    timestamp: new Date()
  });
}); //End member mod_log
bot.on("guldMemberBan", (guild, mem) => {
  if(mem.id == userRemoved.id) return;
  try{
    let user = mem.guild.member(mem.id);
    mem.guild.channels.find("name", "mod_log").sendEmbed({
      color: 6546816,
      author: {
        name: mem.displayName + "#" + user.user.discriminator,
        icon_url: user.user.avatarURL
      },
      title: `${mem.id.toString()} | User Banned`,
      description: `User: ${mem.user} was banned`,
      timestamp: new Date()
    });
  }catch(e){
    console.log(e);
  }
});
bot.on("message", msg => {//Welcome new members
  if(msg.channel.name !== "welcome") return; //if in welcome continue
  if(!msg.author.bot) return; //if a bot continue
  if(msg.author.id === 264995143789182976) return; //if not celestial continue
  let args = msg.content.split(" ").slice(1); //create arguments
  if(msg.author.username == "Celestial") return; //if not celestial continue
  let userToSay = msg.mentions.users.first(); //Store user to say
  msg.delete().catch(console.error); //delete other bots message
  msg.channel.sendMessage(userToSay + " " + args.join(" ")); //repeat message only from celetial this time
});//End member welcome
//---------------------------------| Commands |------------------------------------------
bot.on("message", msg => { //Command chat only
  if(msg.channel.type != "text") return; //If in textChannel continue
  else if(msg.content.startsWith("? ")) return; //If starts with "? " return
  else if(!msg.content.startsWith(config.prefix)) return; //If has prefix continue
  else if(msg.author.bot) return; //If not a bot continue

  let cmd = msg.content.substr(1).split(" ")[0];
  let args = msg.content.split(" ").slice(1);

  let chiefRole = msg.guild.roles.find("name","Bot Chief"); //Assign Bot Chief to chiefRole
  let modRole = msg.guild.roles.find("name", "Mod"); //Assign Mod to modRole
  let adminRole = msg.guild.roles.find("name", "Admin"); //Assign Admin to adminRole
  let staffRole = msg.guild.roles.find("name", "Staff"); //Assign Staff to staffRole
  let seniorRole = msg.guild.roles.find("name", "Senior Member"); //Assign SeniorMember to seniorRole

  switch(cmd) {

    case 'choose':
    case 'pick':
    args = args.join(" ").split(","); // separate each choice
    if(args.length < 2) return msg.channel.sendMessage("You did not define a argument. Usage: `?choose [choice1, choice2, ....]`"); //check for number of choices
    let result = args[Math.floor(Math.random() * args.length)]; // Get random number
    msg.channel.sendMessage(`I choose ${result}.`); //Messages results
    break;

    case 'coin':
    case 'flip':
    case 'coinflip':
    case 'cointoss':
    if(isNaN(args[0])) return msg.channel.sendMessage("You did not define an argument. Usage: `?coinflip [Number]` "); // Didn't use propper command
    else if(args.length == 0 || args[0] > 1000001) {
      let result = (Math.floor(Math.random() * 2) === 0) ? "Heads" : "Tails";
      return msg.channel.sendMessage(`Result is ${result}.`);
    }
    var  heads = 0, tails = 0; // Set the results to a variable
    while(heads + tails < args) { //While loop for the number of coin tosses
      let result = (Math.floor(Math.random() * 2) === 0) ? "heads" : "tails"; //random choice between heads or tails
      if(result == "heads") heads++; //if head, incrament heads
      else tails++; //else incrament tales
    }
    msg.channel.sendMessage(`Results are: ${heads} Heads & ${tails} Tails.`); //put the result in discord
    break;

    case 'prisolis':
    if(msg.author.id != 222883669377810434 && !msg.member.roles.has(adminRole.id)) return msg.reply("You pleb, you don't have permission to this command `?prisolis`.");//limits command to admins and "Mr. Z"
    if(!msg.guild.channels.find("name", "Story Time w/ Mr.Z")){ //If the the channel "Story Time w/ Mr. Z" do this
    msg.guild.createChannel("Story Time w/ Mr.Z", "voice", [ //Create the channel with permisions
      {'id': '212630495098437633', 'type': 'role', 'deny': 0, 'allow': 871366673},
      {'id': '212624757818916864', 'type': 'role', 'deny': 838860816, 'allow': 3145729},
      {'id': '222883669377810434', 'type': 'member', 'deny': 536870928, 'allow': 334495745}]);
      msg.channel.sendMessage("Voice channel named `Story Time w/ Mr.Z` has been created. Use `?prisolis` to delete the channel after use."); //Output text
    } else { //if the command is repeated and deletes the channel
      try {
        let moveToChannel = msg.guild.channels.find("name", "General");
        let mem_array = msg.guild.channels.find("name", "Story Time w/ Mr.Z").members.array();
        mem_array.map(id => msg.guild.member(id).setVoiceChannel(moveToChannel));
      } catch (e) {}
      msg.guild.channels.find("name", "Story Time w/ Mr.Z").delete();
      msg.channel.sendMessage("Voice channel named `Story Time w/ Mr.Z` has been deleted."); //Replies the deletion of the channel
    }
    break;

    case 'tabletop':
    case 'tt':
    if(!msg.member.roles.has(seniorRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?tabletop`."); //Denies their permision
    if(!msg.guild.channels.find("name", "tabletop")){ // find the channel and if it doesn't already exsist
    msg.guild.createChannel("tabletop", "text", [  // create the channel
      {'id': '212630495098437633', 'type': 'role', 'deny': 0, 'allow': 805829713},
      {'id': '212624757818916864', 'type': 'role', 'deny': 805449744, 'allow': 379969},
      {'id': '212631295853985792', 'type': 'role', 'deny': 805441552, 'allow': 388161},
      {'id':  msg.author.id      , 'type': 'member', 'deny': 536875024, 'allow': 268954689}]);
      return msg.channel.sendMessage("Text channal named `#tabletop` has been created. Admins please use `?tabletop` to delete the channel after use."); //replies if the creation was succeful
    }
    else {
      if(!msg.member.roles.has(adminRole.id)) return msg.reply("Pleb, you don't have permission to use this command `?tabletop`.") // checks for admin role to delete channel when the command is repeated
      msg.guild.channels.find("name", "tabletop").delete(); // Deletes the channel
      msg.channel.sendMessage("Text channel named `#tabletop` has been deleted."); // replies when deleted
    }
    break;

    case 'apply':
    case 'app':
    if(args.length < 2) return msg.channel.sendMessage("You did not define an argument. Usage: `?apply [role] [reason]`"); //check for role, reason
    else {
      msg.delete().catch(console.error); //delete message from chat
      let reasonFor = args.slice(1).join(" "); //set reason to arguments
      msg.guild.channels.find("name", "mod_log").sendEmbed({
        color: 7013119,
        author: {
          name: msg.author.username,
          icon_url: msg.author.avatarURL
        },
        title: 'Role Application',
        description: `${msg.author} has applied for the **${args[0]}** Role`,
        fields: [{
          name:'Reason',
          value: reasonFor
        }],
        timestamp: new Date()
      }); //send embedded message
    }
    break;

    case 'info':
    case 'i':
    case '411':
    if(args.length == 0) return msg.reply('You did not define an argument. Usage: `?info ["server" | user]');
    else if(args[0].toString().toLowerCase() == 'server'){
      let guild = msg.channel.guild;
      let botCount = guild.members.filter(user => user.bot);
      let owner = guild.members.get(guild.ownerID);
      console.log(botCount);
      if(isNaN(botCount)) botCount = 3;
      msg.channel.sendEmbed({
        color: 262088,
        title: `Server info for ${msg.guild.name}`,
        description: `Id: ${guild.id}\n` +
        `Created: ${new Date(guild.createdAt).toUTCString()}\n` +
        `Owner: ${owner.user.username}\n` +
        `Members: ${(guild.members.size - botCount)}   Bots: ${botCount}\n` +
        `Icon URL: ${guild.iconURL}`,
        thumbnail: {url: guild.iconURL},
        timestamp: new Date()
      });
    }
    else {
      //try{
        let user = msg.mentions.users.first();
        var weekArray = [
          "Sun,",
          "Mon,",
          "Tue,",
          "Wed,",
          "Thu,",
          "Fri,",
          "Sat,"
        ];
        var monthArray = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        var daysMonths = [
          31,
          28,
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31
        ];

        var date = new Date (msg.guild.member(user).joinedTimestamp).toUTCString() + "";
        var dateArray = date.split(" ");
        var time = dateArray[4];
        var timeArray = time.split(":");
        var hours = timeArray[0] - 4;
        var dayOfWeek = dateArray[0];
        var day = dateArray[1] - 0;
        var month = dateArray[2];
        var year = dateArray[3];
        if (hours < 0) {
          hours = 24 + hours;
          dayOfWeek = week[week.indexOf(dayOfWeek)-1];
          day = day - 1;
          if (day < 1) {
            var i = monthArray.indexOf(month);
            if (i < 0) {
              i = 11;
              year = year - 1;
            }
            month = monthArray[i];
            day = daysMonths[i] - day;
          }
        }
        var finishedTime = hours + ":" + timeArray[1] + ":" + timeArray[2];
        var finishedDate = dayOfWeek +" "+ day +" " + month +" "+ dateArray[3] +" "+ finishedTime +" " + "EST";
        msg.channel.sendEmbed({
          color: 3447003,
          title: `User info for ${user.username}`,
          description:
          `Username: ${user.username}   Nickname: ${msg.guild.member(user).nickname}\n` +
          `User ID: ${user.id}\n` +
          `Discriminator: ${user.discriminator}\n` +
          `Created: ${new Date(user.createdAt).toUTCString()}\n` +
          `Joined: ${finishedDate}\n` +
          `Avatar URL: ${user.avatarURL}`,
          thumbnail: {url: user.avatarURL},
          timestamp: new Date()
        });
      //} catch (e) {
        //msg.reply("Please `@mention` a user to see that users information. " + args[0] + " is not a mention.");
        //deleteAfterTime(msg, 3000, 2);
      //}
    }
    break;

    case "rps":
    if(args.length == 0) return msg.reply("You did not define an argument. Usage `?rps [rock/paper/scissors]`")
    var userChoice = args[0];
    userChoice.toLowerCase();
    var choices = ["rock", "scissors", "paper"];
    var computerChoice = choices[Math.floor(Math.random() * choices.length)];

      var compare = function(choice1, choice2) {
        var rock = { //computers choice
          "rock" : "Its a Draw!",
          "scissors" : "Rock Wins! One point Celestial.",
          "paper" : "Paper Wins! One point -user"
        };
        var paper = { //computers choice
          "rock" : "Paper Wins! One point Celestial",
          "scissors" : "Scissors Wins! One point -user",
          "paper" : "Its a Draw!"
        };
        var scissors = { //computers choice
          "rock" : "Rock Wins! One point -user",
          "scissors" : "Its a Draw!",
          "paper" : "Scissors Wins! One point Celestial"
        };

        if(choice2 == "rock") return rock[choice1];
        else if(choice2 == "scissors") return scissors[choice1];
        else if(choice2 == "paper") return paper[choice1];
        else return "You did not define an argument. Usage `?rps [rock/paper/scissors]`";
      };

      msg.reply(compare(userChoice,computerChoice).replace("-user", msg.author.username));
      break;

    case 'kick':
    if(!msg.member.roles.has(adminRole.id)) { //limit to admin only
      msg.guild.channels.find("name", "mod_log").sendMessage("**" + msg.author + "** has attempted to use the **kick** command in " + msg.channel + ":" + " `" + msg.content + "`"); //record message to modlog
      return msg.reply("You pleb, you don't have permission to use this command `?kick`."); //insult unauthorized user
    } else if(args.length < 2) msg.channel.sendMessage("You did not define an argument. Usage: `?kick [user] [reason]`"); //check for user, and reason
    try{
      msg.delete().catch(console.error); //delete message from chat
      userRemoved = msg.mentions.users.first();
      let userToKick = msg.mentions.users.first(); //set user to ban
      let kickMsg = args.slice(1).join(" "); //set reason to arguments minus user
      msg.guild.member(userToKick).kick(kickMsg); //kick the mentioned user
      msg.guild.members.get(userToKick.id).sendEmbed({
        color: 16733186,
        author: {
          name: msg.guild.name,
          icon_url: msg.guild.iconURL
        },
        title: 'Kicked',
        description: `You have been kicked!`,
        link: config.server_link,
        fields: [{
          name:'Reason',
          value: kickMsg
        }],
        timestamp: new Date()
      });//send pm to user with reason
      msg.guild.channels.find("name", "mod_log").sendEmbed({
        color: 16733186,
        author: {
          name: userToKick.username,
          icon_url: userToKick.avatarURL
        },
        title: 'User Kicked',
        description: `${msg.author} has kicked ${userToKick} `,
        fields: [{
          name:'Reason',
          value: kickMsg
        }],
        timestamp: new Date()
      }); //send embed message to modlog
    } catch(e) {
      msg.reply("Please `@mention` a user to kick. " + args[0] + " is not a mention.");
      deleteAfterTime(msg, 2000, 2);
    }
    break;

    case 'softban':
        if(!msg.member.roles.has(adminRole.id)) { //limit to admin only
          msg.guild.channels.find("name", "mod_log").sendMessage("**" + msg.author + "** has attempted to use the **kick** command in " + msg.channel + ":" + " `" + msg.content + "`"); //record message to modlog
          return msg.reply("You pleb, you don't have permission to use this command `?kick`."); //insult unauthorized user
        } else if(args.length < 2) msg.channel.sendMessage("You did not define an argument. Usage: `?kick [user] [reason]`"); //check for user, and reason
        try{
          msg.delete().catch(console.error); //delete message from chat
          userRemoved = msg.mentions.users.first();
          let userToKick = msg.mentions.users.first(); //set user to ban
          let kickMsg = args.slice(1).join(" "); //set reason to arguments minus user
          msg.guild.member(userToKick).ban(); //ban the mentioned user
          msg.guild.unban(userToKick.id); //unban the mentioned user
          msg.guild.members.get(userToKick.id).sendEmbed({
            color: 16733186,
            author: {
              name: msg.guild.name,
              icon_url: msg.guild.iconURL
            },
            title: 'Kicked',
            description: `You have been kicked!`,
            link: config.server_link,
            fields: [{
              name:'Reason',
              value: kickMsg
            }],
            timestamp: new Date()
          });//send pm to user with reason
          msg.guild.channels.find("name", "mod_log").sendEmbed({
            color: 16733186,
            author: {
              name: userToKick.username,
              icon_url: userToKick.avatarURL
            },
            title: 'User Soft Banned',
            description: `${msg.author} has been soft banned ${userToKick} `,
            fields: [{
              name:'Reason',
              value: kickMsg
            }],
            timestamp: new Date()
          }); //send embed message to modlog
        } catch(e) {
          msg.reply("Please `@mention` a user to softban. " + args[0] + " is not a mention.");
          deleteAfterTime(msg, 2000, 2);
        }
        break;

        case 'ban':
        if(!msg.member.roles.has(adminRole.id)) { //limit to admin only
          msg.guild.channels.find("name", "mod_log").sendMessage("**" + msg.author + "** has attempted to use the **ban** command in " + msg.channel + ":" + " `" + msg.content + "`"); //record message to modlog
          return msg.reply("You pleb, you don't have permission to use this command `?ban`."); //insult unauthorized user
        } else if(args.length < 2) msg.channel.sendMessage("You did not define an argument. Usage: `?ban [user] [reason]`"); //check for user, and reason
        try{
          msg.delete().catch(console.error); //delete message from chat
          userRemoved = msg.mentions.users.first();
          let userToBan = msg.mentions.users.first(); //set user to ban
          let banMsg = args.slice(1).join(" "); //set reason to arguments minus user
          msg.guild.member(userToBan).ban(); //ban the mentioned user
          msg.guild.members.get(userToBan.id).sendEmbed({
            color: 16721408,
            author: {
              name: msg.guild.name,
              icon_url: msg.guild.iconURL
            },
            title: 'Banned',
            description: `You have been banned!`,
            link: config.server_link,
            fields: [{
              name:'Reason',
              value: banMsg
            }],
            timestamp: new Date()
          });//send pm to user with reason
          msg.guild.channels.find("name", "mod_log").sendEmbed({
            color: 16721408,
            author: {
              name: userToBan.username,
              icon_url: userToBan.avatarURL
            },
            title: 'User Banned',
            description: `${msg.author} has been banned ${userToBan} `,
            fields: [{
              name:'Reason',
              value: banMsg
            }],
            timestamp: new Date()
          }); //send embed message to modlog
        } catch(e) {
          msg.reply("Please `@mention` a user to ban. " + args[0] + " is not a mention.");
          deleteAfterTime(msg, 2000, 2);
        }
        break;


        case 'warn':
    if(!msg.member.roles.has(staffRole.id) && !msg.member.roles.has(modRole.id) && !msg.member.roles.has(adminRole.id)) { //limit to staff only
      msg.guild.channels.find("name", "mod_log").sendMessage("**" + msg.author + "** has attempted to use the **warn** command in " + msg.channel + ":" + " `" + msg.content + "`"); //record message to modlog
      return msg.reply("You pleb, you don't have permission to use this command `?warn`."); //insult unauthorized user
    } else if(args.length < 2) msg.channel.sendMessage("You did not define an argument. Usage: `?warn [user] [message]`"); //check for user, and reason
    try {
      msg.delete().catch(console.error); //delete message from chat
      let userToWarn = msg.mentions.users.first(); //set user to warn
      let warnMsg = args.slice(1).join(" "); //set reason to arguments minus user
      let highestRole = "Staff";
      console.log(userToWarn);
      if(msg.member.roles.has(adminRole.id)) highestRole = "Admin";
      else if(msg.member.roles.has(modRole.id)) highestRole = "Mod";
      else highestRole = "Staff";
      msg.guild.members.get(userToWarn.id).sendEmbed({
        color: 16774400,
        author: {
          name: msg.guild.name,
          icon_url: msg.guild.iconURL
        },
        title: 'Warning',
        description: `You have been warned by ${highestRole}`,
        fields: [{
          name:'Reason',
          value: warnMsg
        }],
        timestamp: new Date()
      }).catch(console.error); //send pm to user with reason
      msg.guild.channels.find("name", "mod_log").sendEmbed({
        color: 16774400,
        author: {
          name: userToWarn.username,
          icon_url: userToWarn.avatarURL
        },
        title: 'User Warned',
        description: `${msg.author} has warned ${userToWarn}`,
        fields: [{
          name:'Reason',
          value: warnMsg
        }],
        timestamp: new Date()
      }).catch(console.error); //send embed message to modlog
    } catch(e) {
      msg.channel.sendMessage("Please `@mention` a user to warn. " + args[0] + " is not a mention.");
      deleteAfterTime(msg, 2000, 2);
      console.log(e);
    }
    break;

    case 'ping':
    msg.channel.sendMessage("pong!").catch(console.error);
    break;

    case 'roles':
    msg.channel.sendEmbed({
      color: 10826739,
      author: {
        name: msg.guild.name,
        icon_url: msg.guild.iconURL
      },
      title: 'Roles',
      description: "Below is a list of roles and a short description describing them.",
      fields: [{
        name:'Admin (Primary Role)',
        value:'administrator role, they are the owners and rulers of the server'
      },{
        name:'Mod (Primary Role)',
        value:'moderator role, they are here to help and have some power over the server and those in it'
      },{
        name:'Bot (Primary Role)',
        value:'role given to all bots that join/are invited to the server, allowing a clear separation from members'
      },{
        name:'Senior Member (Primary Role)',
        value:'role given to members who are actively participating in the server and have been so for an extended period of time, with a little more effort youll be a staff member in no time'
      },{
        name:'Member (Primary Role)',
        value:'basic role, but shows you are a regular on the server and community'
      },{
        name:'Staff (Secondary Role)',
        value:'pre-moderator role, they are here to help those new to the server and are given little power over the server to show that they are trustworthy'
      },{
        name:'Streamer (Secondary Role)',
        value:'streamer role, given to members who would like to stream on the channel with the highest quality of sound possible and permission to manage the members in that channel'
      },{
        name:'Streaming (Secondary Role)',
        value:'streamer friend role, given to individuals that are allowed to participate in streams giving them voice in the recording chats'
      },{
        name:'Bot Chief (Secondary Role)',
        value:'bot management role, allows you to use certain commands on the bots, like skipping songs without a vote or controlling the volume'
      }],
      timestamp: new Date()
    }).catch(console.error);
    break;

    case 'permission':
    if(!msg.member.roles.has(adminRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?permission`.");
    if(args[0] == "channel") {
      if(!msg.guild.channels.get(args[1])) return msg.channel.sendMessage(`${args[1]} does not exist. Please copy and paste the ID of the channel.`);
      let pCollection = msg.guild.channels.get(args[1]).permissionOverwrites;
      console.log(pCollection);
      msg.delete();
    }
    else if(args[0] == "member"){
      if(!msg.guild.members.get(args[1])) return msg.channel.sendMessage(`${args[1]} does not exist. Please copy and paste the ID of the member.`);
      let pCollection = msg.guild.members.get(args[1]).permissions;
      console.log(pCollection);
      msg.delete();
    }
    else msg.channel.sendMessage("You did not define an argument. Usage: `?permission [type] [ID]`"); //check for message count
    break;

    case 'move':
    case 'm':
    if(!msg.member.roles.has(adminRole.id) && !msg.member.roles.has(modRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?move`."); //insult unauthorized user
    else if(args.length < 2) {
      msg.channel.sendMessage("You did not define enough arguments. Usage: `?move [VC from ID] [VC to ID]`"); //check for message to move
      return deleteAfterTime(msg, 2000, 2);
    } else if(isNaN(args[0]) || isNaN(args[1])){
      msg.channel.sendMessage("You did not define an argument. Usage: `?move [VC from ID] [VC to ID]`");
      return  deleteAfterTime(msg, 3000, 2);
    }
      let mem_array = msg.guild.channels.get(args[0]).members.array();
     if(mem_array.length < 1) {
      msg.channel.sendMessage(`Currently there are no members in ${msg.guild.channels.get(args[0]).name}. Please try again.`);
      return deleteAfterTime(msg, 2000, 2);
    }
    try {
      msg.delete();
      mem_array.map(id => msg.guild.member(id).setVoiceChannel(msg.guild.channels.get(args[1])));
    } catch (e){
      msg.channel.sendMessage("One of the provided channel ID's does not exist. Please make sure that the numbers provided are ID's");
      deleteAfterTime(msg, 3000, 1);
    }
    break;

    case 'invite':
    case 'inv':
    if(msg.channel.name != "commands") msg.delete();
    else if(args.length == 0) msg.channel.sendMessage("You did not define an argument. Usage: `?invite [permanent/temporary]`")
    else if(args[0].toLowerCase().startsWith("perm")) msg.reply(config.server_link + " is a permanent link for new members.");
    else if(args[0].toLowerCase().startsWith("temp")) msg.reply(config.temp_link + " is a temporary link for visiting members.");
    else msg.channel.sendMessage("You did not define an argument. Usage: `?invite [permanent/temporary]`");
    break;
  }
});

bot.on("message", msg => { //Command chat only
  if(msg.channel.type != "text") return; //If in textChannel continue
  else if(!msg.content.startsWith(config.prefix)) return; //If has prefix continue
  else if(msg.content.startsWith("? ")) return; //If starts with "? " return
  else if(msg.author.bot) return; //If not a bot continue

  let cmd = msg.content.substr(1).split(" ")[0];
  let args = msg.content.split(" ").slice(1);

  let chiefRole = msg.guild.roles.find("name","Bot Chief"); //Assign Bot Chief to chiefRole
  let modRole = msg.guild.roles.find("name", "Mod"); //Assign Mod to modRole
  let adminRole = msg.guild.roles.find("name", "Admin"); //Assign Admin to adminRole
  let staffRole = msg.guild.roles.find("name", "Staff"); //Assign Staff to staffRole
  let seniorRole = msg.guild.roles.find("name", "Senior Member"); //Assign SeniorMember to seniorRole

  switch(cmd) {

  case 'prune':
  case 'purge':
  var mdLimit;
  if(msg.member.roles.has(adminRole.id)) mdLimit = 100; //limit to admin only
  else if(msg.member.roles.has(modRole.id)) mdLimit = 20; //limit to mod only
  else return msg.reply("You pleb, you don't have permission to use this command `?purge | ?prune`."); //insult unauthorized user
  if(args.length === 0) return msg.channel.sendMessage("You did not define an argument. Usage: `?prune [number]`"); //check for message count
  if(isNaN(args[0])) return msg.channel.sendMessage(args[0] + " is not a number.")
  let messagecount = parseInt(args[0]); //fetch the number of messages to prune
  msg.channel.fetchMessages({limit: mdLimit}).then(msg => { // get the channel logs
    let msg_array = msg.array(); //create an array for messages
    msg_array.length = messagecount < mdLimit ? messagecount + 1: mdLimit;//limit to the requested number + 1 for the command message
    msg_array.map(m => m.delete().catch(console.error));//has to delete messages individually.
  });
  msg.channel.sendMessage(`${messagecount} messages have been deleted.`).catch(console.error);
  deleteAfterTime(msg, 2000, 1);
  break;

  case 'letsplay':
  case 'lp':
  msg.delete();
  if(msg.member.roles.array().length == 1) return msg.reply("You must have at least one role to be eligible for this channel.");
  if(args.length == 0) return msg.channel.sendMessage(`@here **${msg.author.username}** would like to play a game!`);
  else return msg.channel.sendMessage(`@here **${msg.author.username}** would like to play **${args.join(" ")}**!`);
  break;

  case 'say':
  case 'speak':
  if(!msg.member.roles.has(adminRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?say`."); //limit to admin only
  else if(args.length === 0) return msg.channel.sendMessage("You did not define an argument. Usage: `?say [message]`"); //check for message to say
  msg.delete().catch(console.error); //delete message from chat
  msg.channel.sendMessage(args.join(" ")); //display echoed message as bot
  break;

  case 'commands':
  case 'cmds':
  msg.author.sendMessage("This is a link to a list of all the commands. https://goo.gl/w89Gb8");
  msg.delete().catch(console.error);
  break;

  case 'test':
  console.log(msg.guild.member(msg.author).joinedTimestamp);
  break;

  case 'help':
  case 'h':
  if(args.length === 0)
  msg.channel.sendEmbed({
    color: 262088,
    author: {
      name: msg.guild.name,
      icon_url: msg.guild.iconURL
    },
    title: 'Help',
    description: 'Invalid category/command',
    fields: [{
      name:'Categories',
      value: 'Fun, Moderation, Utility'
    },{
      name:'For more certain commands, type in a category',
      value:'Usage: `?help [category|command]`'
    }],
    timestamp: new Date()
  }).catch(console.error);
  else if(args[0].toLowerCase().startsWith("fun"))
  msg.channel.sendMessage("**Fun commands include `?choose`, `?coinflip`, `?prisolis`, `?tabletop`**");
  else if(args[0].toLowerCase().startsWith("mod"))
  msg.channel.sendMessage("**Moderation commands include `?apply`, `?ban`, `?kick`, `?warn`, `?purge`**");
  else if(args[0].toLowerCase().startsWith("util"))
  msg.channel.sendMessage("**Utility commands include `?commands`, `?help`, `?info`, `?inrole`, `?invite`, `?move`, `?ping`, `?rename`, `?roles`, `?say`, `?status`**");
  else if(args[0].toLowerCase().startsWith("choose"))
  information(msg, "Choose", "This command will allow the bot to choose between choices provided to her.", "Fun", "Everyone", "?choose [choice1],[choice2] ...", "N/A");
  else if(args[0].toLowerCase().startsWith("coinflip"))
  information(msg, "Coinflip", "This command will ask the bot to flip a coin or coins, then return the results.", "Fun", "Everyone", "?coinflip [number of coins]", "?coin | ?flip | ?cointoss ");
  else if(args[0].toLowerCase().startsWith("prisolis"))
  information(msg, "Prisolis", "This command creates a channel used for “Storytime with Mr.Z”, aka Zeadron, as he develops his new books.", "Fun", "Zeadron Only", "?prisolis", "N/A");
  else if(args[0].toLowerCase().startsWith("tabletop"))
  information(msg, "Tabletop", "This command creates a text channel used for events.", "Fun", "Member, Staff", "?tabletop", "?tt");
  else if(args[0].toLowerCase().startsWith("apply"))
  information(msg, "Apply", "This command allows users to apply for roles that they wish to obtain. They can do so by stating a reason why they wish to be approved.", "Moderation", "Everyone", "?apply [role] [reason]", "app");
  else if(args[0].toLowerCase().startsWith("ban"))
  information(msg, "Ban", "This command bans the specified member from the server while sending them a message and logging the reason.", "Moderation", "Admin Only", "?ban @[username] [reason]", "N/A");
  else if(args[0].toLowerCase().startsWith("kick"))
  information(msg, "Kick", "This command kicks members from the server while sending them a message and logging the reason.", "Moderation", "Admin Only", "?kick @[username] [reason]", "N/A");
  else if(args[0].toLowerCase().startsWith("purge"))
  information(msg, "Purge", "This command removes a specified number of messages from the channel. Flags or filters can be added to further specify the messages, such filters would remove messages of a specific content or from a specific author.", "Moderation", "Staff role", "?purge 23 | ?purge 4 @[username]", "?prune");
  else if(args[0].toLowerCase().startsWith("warn"))
  information(msg, "Warn", "This command sends a warning message to specified member of the server. It also logs the message sent.", "Moderation", "Staff", "?warn @[username] [reason]", "N/A");
  else if(args[0].toLowerCase().startsWith("commands"))
  information(msg, "Commands", "This command will send a link or an image of the commands allowed by your roles for Celestial (the bot) to the user in a private message.", "Utilities", "Everyone", "?commands", "?cmds | ?c");
  else if(args[0].toLowerCase().startsWith("help"))
  information(msg, "Help", "This command will display a list of command groups and provide a command or group to see other information. (examples: usage, alias, description)", "Utilities", "Everyone", "?help | ?help moderation", "?h");
  else if(args[0].toLowerCase().startsWith("info"))
  information(msg, "Info", "This command will display information about the server or a specified user.", "Utilities", "Everyone", "?info server | ?info @[username] | ?info", "?i | ?411");
  else if(args[0].toLowerCase().startsWith("inrole"))
  information(msg, "Inrole", "This command will display a list of all users that are in the specified role.", "Utilities", "Everyone", "?inrole [Role]", "N/A");
  else if(args[0].toLowerCase().startsWith("move"))
  information(msg, "Move", "This command will move members in a certain voice channel to another", "Utilities", "Staff Only", "?move [Ch. ID from] [Ch. ID to]", "N/A");
  else if(args[0].toLowerCase().startsWith("ping"))
  information(msg, "Ping", "This command will test if the bot in online and the time it takes to respond.", "Utilities", "Everyone", "?ping", "N/A");
  else if(args[0].toLowerCase().startsWith("rename"))
  information(msg, "Rename", "This command allows users to rename the current voice channel they are in.", "Utilities", "Everyone", "?rename [New Room Name]", "N/A");
  else if(args[0].toLowerCase().startsWith("roles"))
  information(msg, "Roles", "This command will display the roles, as well as a brief description of the role, its purposes, and weather it is primary or secondary.", "Utilities", "Everyone", "?roles", "N/A");
  else if(args[0].toLowerCase().startsWith("say"))
  information(msg, "Say", "This command will say the message from the bot account, therefore making the message anonymous.", "Utilities", "Admin Only", "?say Hi everyone", "N/A");
  else if(args[0].toLowerCase().startsWith("status"))
  information(msg, "Status", "This command will display the current status of the bot.", "Utilities", "Staff Only", "?status", "?stat");
  else if(args[0].toLowerCase().startsWith("invite"))
  information(msg, "Invite", "This command will send links to member who would like to invite people, to ensure that all new members are sent to the #information page first.", "Utilities", "Everyone", "?invite [permanent/temporary]", "?inv");
  else msg.channel.sendMessage(`That command ${args[0]} does not exist.`);
  deleteAfterTime(msg, 15000, 2);
  break;
  }
});
//---------------------------------------| Message |---------------------------------------------------------
bot.on("message", msg => {//Private Messages
  if(msg.channel.type != "dm") return; //If DM continue
  if(msg.author.bot) return; //If not bot continue
  console.log(msg.author.username + ": " + msg.content); //Log messages sent to bot
  if(!msg.content.toLowerCase() == "clean" && !msg.content.toLowerCase() == "?clean")
    msg.channel.sendMessage(`Hello, my name is **Celestial**! I am __**${config.server_name}**__ server's personal bot! ${server_link}`); //Default Message
  msg.channel.fetchMessages().then(msg => { // get the channel logs
    let msg_array = msg.array(); //create an array for messages
    msg_array.map(m => m.delete().catch(console.error));//has to delete messages individually.
  });
}); //End Private Message
