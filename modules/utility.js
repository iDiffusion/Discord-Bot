
exports.cleanMessages = (PREFIX, msg, bot) => {
  msg.channel.fetchMessages().then(msg => { // get the channel logs
    let msg_array = msg.array(); //create an array for messages
    msg_array.map(m => m.delete().catch(console.error));//has to delete messages individually.
  });
}

exports.commands = (PREFIX, msg) => {
  msg.author.sendMessage("This is a link to a list of all the commands. https://goo.gl/w89Gb8");
  msg.delete().catch(console.error);
}

exports.commands = (PREFIX, msg) => {
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
}

exports.information = (PREFIX, msg, bot) => {
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
}

exports.invite = (PREFIX, msg, bot) => {
  if(msg.channel.name != "commands") msg.delete();
  else if(args.length == 0) msg.channel.sendMessage("You did not define an argument. Usage: `?invite [permanent/temporary]`")
  else if(args[0].toLowerCase().startsWith("perm")) msg.reply(config.server_link + " is a permanent link for new members.");
  else if(args[0].toLowerCase().startsWith("temp")) msg.reply(config.temp_link + " is a temporary link for visiting members.");
  else msg.channel.sendMessage("You did not define an argument. Usage: `?invite [permanent/temporary]`");
  break;
}

exports.ping = (PREFIX, msg, bot) => {
  msg.channel.sendMessage("pong!").catch(console.error);
}

exports.purge = (PREFIX, msg, bot) => {
  let args = msg.content.split(" ").slice(1);
  let mdLimit = 25;
  if(msg.channel.tpye == "dm"){
    return msg.channel.sendMessage("Unable to use this command in private chat.");
  }
  else if(!msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){
    return msg.channel.sendMessage("Unable to complete request to prune messages, I don't have the necessary permissions: `MANAGE_MESSAGES`\n An admin or server owner must change this before you are able to use this command.");
  }
  else if(!msg.member.hasPermission("MANAGE_MESSAGES")){
    return msg.reply(`You pleb, you don't have permission to use this command: \`${PREFIX}purge\``);
  }
  else if(args.length === 0) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}prune [number]\``);
  }
  else if(isNaN(args[0])) {
    return msg.channel.sendMessage(args[0] + " is not a number.");
  }
  else {
    let messagecount = parseInt(args[0]); //fetch the number of messages to prune
    msg.channel.fetchMessages({limit: mdLimit}).then(msg => { // get the channel logs
      let msg_array = msg.array(); //create an array for messages
      msg_array.length = messagecount < mdLimit ? messagecount + 1: mdLimit;//limit to the requested number + 1 for the command message
      msg_array.map(m => m.delete().catch(console.error));//has to delete messages individually.
    });
    msg.channel.sendMessage(`${messagecount} messages have been deleted.`).catch(console.error);
    deleteAfterTime(msg, 2000, 1);
  }
}

exports.say = (PREFIX, msg) => {
  if(!msg.member.roles.has(adminRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?say`."); //limit to admin only
  else if(args.length === 0) return msg.channel.sendMessage("You did not define an argument. Usage: `?say [message]`"); //check for message to say
  msg.delete().catch(console.error); //delete message from chat
  msg.channel.sendMessage(args.join(" ")); //display echoed message as bot
}

exports.suggestion(PREFIX, msg, bot) => {
  return msg.channel.sendMessages(`This command is currently unavaiiable, if you wish to know when this command will be implemented feel free to message me.`);
}
