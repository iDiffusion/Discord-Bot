const underscore = require("underscore");
const cmdChannelName = "commands";

//THIS FUNCTION IS FINISHED
exports.choose  = (PREFIX, msg) => {
  if(msg.channel.name != cmdChannelName) {
    msg.delete();
  }
  let args = msg.content.split(" ").slice(1).join(" ").split(",");
  if(args.length == 0) {
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}choose [choice1, choice2, ....]\``);
  }
  let result = underscore.sample(args);
  return msg.reply(`I choose **${result}**.`);
}

//THIS FUNCTION IS FINISHED
exports.coinFlip = (PREFIX, msg) => {
  let choices = ["Head", "Tail"];
  let result = underscore.sample(choices);
  return msg.channel.sendMessage(`Result is ${result}.`);
}

//THIS FUNCTION IS FINISHED
exports.prisolis = (PREFIX, msg) => {
  let channelName = "Story Time w/ Mr.Z";
  if(msg.guild.id != config.guild_id) { //limit to my guilds
    return;
  }
  if(msg.author.id != 222883669377810434 && !msg.member.hasPermssion("manageChannels")) {
    return msg.reply(`You pleb, you don't have permission to this command \`${PREFIX}prisolis\`.`);
  }
  if(msg.channel.name != cmdChannelName && msg.guild.channels.find("name", cmdChannelName)) {
    return msg.delete();
  }
  let storyTime = msg.guild.channels.find("name", channelName);
  if(!storyTime){
    msg.guild.createChannel(channelName, "voice", [
      {'id': '212630495098437633', 'type': 'role', 'deny': 0, 'allow': 871366673},
      {'id': '212624757818916864', 'type': 'role', 'deny': 838860816, 'allow': 3145729},
      {'id': '222883669377810434', 'type': 'member', 'deny': 536870928, 'allow': 334495745}]
    );
    msg.channel.sendMessage("Voice channel named `" + channelName + "` has been created. Use `?prisolis` to delete the channel after use.");
  }
  else {
    try {
      let moveToChannel = msg.guild.channels.find("name", "General");
      let mem_array = storyTime.members.array();
      mem_array.map(id => msg.guild.member(id).setVoiceChannel(moveToChannel));
    }
    catch (e) {}
    storyTime.delete();
    msg.channel.sendMessage("Voice channel named `Story Time w/ Mr.Z` has been deleted.");
  }
}

//NEED TO ALLOW OTHER GUILDS TO USE THIS FUNCTION
exports.tabletop = (PREFIX, msg) => {
  if(msg.guild.id != 212624757818916864) { //limit to my guilds
    return msg.delete.catch(console.error);
  }
  else if(!msg.member.hasPermssion("manageChannels")){
    return msg.reply("You pleb, you don't have permission to use this command `?tabletop`.");
  }
  else if(msg.channel.name != cmdChannelName) {
    return msg.delete().catch(console.error);
  }
  else if(!msg.guild.channels.find("name", "tabletop")){
    msg.guild.createChannel("tabletop", "text", [
      {'id': '212630495098437633', 'type': 'role', 'deny': 0, 'allow': 805829713},
      {'id': '212624757818916864', 'type': 'role', 'deny': 805449744, 'allow': 379969},
      {'id': '212631295853985792', 'type': 'role', 'deny': 805441552, 'allow': 388161},
      {'id':  msg.author.id      , 'type': 'member', 'deny': 536875024, 'allow': 268954689}]);
    return msg.channel.sendMessage("Text channal named `#tabletop` has been created. Admins please use `?tabletop` to delete the channel after use.");
  }
  else {
    msg.guild.channels.find("name", "tabletop").delete();
    msg.channel.sendMessage("Text channel named `#tabletop` has been deleted.");
  }
}

//THIS FUNCTION IS FINISHED
exports.letsplay = (PREFIX, msg) => {
  let args = msg.content.split(" ").slice(1);
  msg.delete();
  if(msg.member.roles.array().length == 1) return msg.reply("You must have at least one role to be eligible for this channel.");
  if(args.length == 0) return msg.channel.sendMessage(`@here **${msg.author.username}** would like to play a game!`);
  else return msg.channel.sendMessage(`@here **${msg.author.username}** would like to play **${args.join(" ")}**!`);
}

//THIS FUNCTION IS FINISHED
exports.rps = (PREFIX, msg) => {
  let args = msg.cleanContent.split(" ").slice(1);
  if(args.length == 0) return msg.reply(`You did not define an argument. Usage \`${PREFIX}rps [rock/paper/scissors]\``);
  var userChoice = args[0].toLowerCase();
  var choices = ["rock", "paper", "scissors"];
  var computerChoice = underscore.sample(choices);
  userChoice = choices.indexOf(userChoice) != -1 ? userChoice : "default";
  var compare = function(choice1, choice2) {
    var rock = {
      "rock" : "Its a Draw!",
      "scissors" : "Rock Wins! One point $bot.",
      "paper" : "Paper Wins! One point $user.",
      "default" : "Rock Wins! One point $bot."
    };
    var paper = {
      "rock" : "Paper Wins! One point $bot.",
      "scissors" : "Scissors Wins! One point $user.",
      "paper" : "Its a Draw!",
      "default" : "Paper Wins! One point $bot."
    };
    var scissors = {
      "rock" : "Rock Wins! One point $user.",
      "scissors" : "Its a Draw!",
      "paper" : "Scissors Wins! One point $bot.",
      "default" : "Scissors Wins! One point $bot."
    };
    if(choice2 == "rock") return rock[choice1];
    else if(choice2 == "scissors") return scissors[choice1];
    else if(choice2 == "paper") return paper[choice1];
    else return "You did not define an argument. Usage `?rps [rock/paper/scissors]`";
  };
  msg.reply(compare(userChoice,computerChoice).replace("$user", msg.author.username).replace("$bot", bot.user.username));
}

//THIS FUNCTION IS FINISHED
exports.reverse = (PREFIX, msg) =>{
  let args = msg.cleanContent.split(" ").slice(1).join(" ").split("");
  args.reverse();
  msg.reply(`Your message reversed is **${args.join("")}**.`);
}

//MAY ADD MULTIPLE DIFFERENT SIDED DIE IN ONE COMMAND
exports.rollDice = (PREFIX, msg) => {
  let args = msg.cleanContent.split(" ").slice(1);
  let numLimit = 10;
  let sideLImit = 100;
  if(args.length != 1){ // limit to only one argument
    return msg.reply(`You did not define an argument. Usage \`${PREFIX}rollDice [number]d[number]\``);
  }
  else if(isNaN(args[0])){ //check if d is present
    args.split("d");
    if(args.length != 2) { //if unable to split string
      return msg.reply(`You did not define an argument. Usage \`${PREFIX} rollDice [number]d[number]\``);
    }
  }
  else {// if only a number is present
    args[1] = 6;
  }
  try{
    var valArray = [];
    args[0] = args[0] < numLimit ? args[0] : numLimit;
    for(i = 1; i <= args[0]; i++){ //repeat for the number of die
      args[1] = args[1] < sideLimit ? args[1] : sideLimit;
      let tempVal = Math.floor(Math.random() * args[1]) + 1;
      if(tempVal == args[1] + 1){ //check for outofbounds case
        tempVal = args[1];
      }
      valArray.push(tempVal);
    }
    let sum = valArray.reduce((total, current) => current += total);
    let average = sum/valArray.length;
    msg.reply(`Your rolls are \`${valArray.join(", ")}\` \n The sum is **${sum}** and the average is **${average}**.`);
  }
  catch(e){
    return msg.reply(`You did not define an argument. Usage \`${PREFIX}rollDice [number]d[number]\` or \`${PREFIX}rollDice [number]\``);
  }
}
