function deleteAfterTime(msg, timer, num){
  msg.channel.fetchMessages({limit: num}).then(msg => { // get the channel logs
    let msg_array = msg.array(); //create an array for messages
    msg_array.length = num;//limit to the requested number + 1 for the command message
    msg_array.map(m => m.delete(timer).catch(console.error));//has to delete messages individually.
  });
}

exports.cleanMessages = (PREFIX, msg, bot) => {
  msg.channel.fetchMessages()
  .then(message => { // get the channel logs
    let msg_array = message.array().filter(message => message.id == bot.id); //create an array for messages
    msg_array.map(m => m.delete().catch(console.error));//has to delete messages individually.
  });
}

exports.commands = (PREFIX, msg) => {
  msg.author.sendMessage("This is a link to a list of all the commands. https://goo.gl/w89Gb8");
  msg.delete().catch(console.error);
}

exports.help = (PREFIX, msg) => {
  return msg.channel.sendMessages(`This command is currently unavaiiable, if you wish to know when this command will be implemented feel free to message me.`);
}

exports.information = (PREFIX, msg, bot) => {
  let args = msg.content.trim().split(/ +/g).slice(1);
  if(args.length == 0) {
    return msg.reply(`You did not define an argument. Usage: \`${PREFIX}info ["server" | "bot" | user]\``);
  }
  else if(args[0].toString().toLowerCase() == 'server'){
    let guild = msg.channel.guild;
    let botCount = guild.members.filter(mem => mem.user.bot).length;
    if(isNaN(botCount)) botCount = 1;
    msg.channel.sendEmbed({
      color: 262088,
      title: `Server info for ${msg.guild.name}`,
      description:
      `Guild Id: ${guild.id}\n` +
      `Created: ${new Date(guild.createdAt).toUTCString()}\n` +
      `Owner: ${guild.owner.displayName}\n` +
      `Members: ${guild.members.size - botCount}   Bots: ${botCount}\n` +
      `Icon URL: ${guild.iconURL}`,
      thumbnail: {url: guild.iconURL},
      timestamp: new Date()
    });
  }
  else if(args[0].toString().toLowerCae() == 'bot'){
    let user = bot.user;
    msg.channel.sendEmbed({
      color: 3447003,
      title: `User info for ${user.username}`,
      description:
      `Username: ${user.username}   Nickname: ${msg.guild.member(user).nickname}\n` +
      `User ID: ${user.id}\n` +
      `Discriminator: ${user.discriminator}\n` +
      `Created: ${new Date(user.createdAt).toUTCString()}\n` +
      `Joined: ${new Data(msg.guild.member(user).joinedTimestamp).toUTCString()}\n` +
      `Avatar URL: ${user.avatarURL}`,
      thumbnail: {url: user.avatarURL},
      timestamp: new Date()
    });
  }
  else {
    try{
      let user = msg.mentions.users.first();
      msg.channel.sendEmbed({
        color: 3447003,
        title: `User info for ${user.username}`,
        description:
        `Username: ${user.username}   Nickname: ${msg.guild.member(user).nickname}\n` +
        `User ID: ${user.id}\n` +
        `Discriminator: ${user.discriminator}\n` +
        `Created: ${new Date(user.createdAt).toUTCString()}\n` +
        `Joined: ${new Data(msg.guild.member(user).joinedTimestamp).toUTCString()}\n` +
        `Avatar URL: ${user.avatarURL}`,
        thumbnail: {url: user.avatarURL},
        timestamp: new Date()
      });
    } catch (e) {
      msg.reply("Please `@mention` a user to see that users information. " + args[0] + " is not a mention.");
      deleteAfterTime(msg, 3000, 2);
    }
  }
}

exports.invite = (PREFIX, msg, bot, config, auth) => {
  let args = msg.content.trim().split(/ +/g).slice(1);
  if(args.length == 0) {
    msg.channel.sendMessage("You did not define an argument. Usage: `?invite [perm/temp/bot]`");
  }
  else if(args[0].toLowerCase().startsWith("perm")){
    msg.reply(config.server_link + " is a permanent link for new members.");
  }
  else if(args[0].toLowerCase().startsWith("temp")){
    msg.reply(config.temp_link + " is a temporary link for visiting members.");
  }
  else if(args[0].toLowerCase().startsWith("bot")){
    msg.reply(auth.bot_link + " is a invite limk for me.");
  }
  else {
    msg.channel.sendMessage("You did not define an argument. Usage: `?invite [perm/tmep/bot]`");
  }
}

exports.ping = (PREFIX, msg, bot) => {
  msg.channel.sendMessage(`pong!\`${bot.ping}ms\``);
}

exports.purge = (PREFIX, msg, bot) => {
  let args = msg.content.trim().split(/ +/g).slice(1);
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
    try{
    let messagecount = parseInt(args[0]).catch(console.error); //fetch the number of messages to prune
    deleteAfterTime(msg, 0, messagecount + 1);
    msg.channel.sendMessage(`${messagecount} messages have been deleted.`).catch(console.error);
    deleteAfterTime(msg, 2000, 1);
  }
    catch(err){}
  }
}

exports.say = (PREFIX, msg) => {
  let args = msg.content.trim().split(/ +/g).slice(1);
  if(!msg.member.hasPermission("ADMINISTRATOR")) {
    return msg.reply(`You pleb, you don't have permission to use this command \`${PREFIX}say\`.`); //limit to admin only
  }
  else if(args.length === 0) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}say [message]\``); //check for message to say
  }
  else {
    msg.delete().catch(console.error); //delete message from chat
    msg.channel.sendMessage(args.join(" ")); //display echoed message as bot
  }
}

exports.suggestion = (PREFIX, msg, bot, config) => {
  return msg.channel.sendMessages(`This command is currently unavaiiable, if you wish to know when this command will be implemented feel free to message me.`);
}
