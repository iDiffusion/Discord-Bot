export function choose(msg, args){
  args = args.join(" ").split(","); //
  if(args.length < 2) {
    msg.channel.sendMessage("You did not define an argument. Usage: `?choose [choice1, choice2, ....]`"); //
    return 0;
  }
  let result = args[Math.floor(Math.random()*args.length)];
  msg.channel.sendMessage(`I choose ${result}.`);
  return 1;
}

export function coinFlip(msg, args){
  if(isNaN(args[0])){
    msg.channel.sendMessage("You did not define an argument. Usage: `?coinFlip [Integer]`");
    return 0;
  }
  else if(args.length == 0 || args[0] > 1000){
    let result = (Math.floor(Math.random() * 2) == 0) ?"Heads" : "Tails";
    msg.channel.sendMessage(`Result is ${result}.`);
    return 1;
  }
  var heads = 0, tails = 0;
  while(heads+tails<args){
    let result = (Math.floor(Math.random() * 2) == 0) ?"Heads" : "Tails";
    if(result == "Heads") heads++;
    else tails++;
  }
  msg.channel.sendMessage(`Results are: ${heads} Heads & ${tails} Tails.`);
  return 1;
}

export function prisolis(msg,args){
  if(msg.guild.id != 212624757818916864 && msg.guild.id != 267886997467693056) return;
  if(msg.author.id != 222883669377810434 && !msg.member.roles.has(adminRole.id)) return msg.reply("You pleb, you don't have permission to this command `?prisolis`.");
  if(!msg.guild.channels.find("name", "Story Time w/ Mr.Z")){
  msg.guild.createChannel("Story Time w/ Mr.Z", "voice", [
   {'id': '212630495098437633', 'type': 'role', 'deny': 0, 'allow': 871366673},
   {'id': '212624757818916864', 'type': 'role', 'deny': 838860816, 'allow': 3145729},
   {'id': '222883669377810434', 'type': 'member', 'deny': 536870928, 'allow': 334495745}]);
   msg.channel.sendMessage("Voice channel named `Story Time w/ Mr.Z` has been created. Use `?prisolis` to delete the channel after use.");
 }
  else {
   try {
     let moveToChannel = msg.guild.channels.find("name", "General");
     let mem_array = msg.guild.channels.find("name", "Story Time w/ Mr.Z").members.array();
     mem_array.map(id => msg.guild.member(id).setVoiceChannel(moveToChannel));
   }
   catch (e) {}
   msg.guild.channels.find("name", "Story Time w/ Mr.Z").delete();
   msg.channel.sendMessage("Voice channel named `Story Time w/ Mr.Z` has been deleted.");
 }
}

export function tabletop(msg,args){
  if(msg.guild.id != 212624757818916864 && msg.guild.id != 267886997467693056) return;
  if(!msg.member.roles.has(seniorRole.id)) return msg.reply("You pleb, you don't have permission to use this command `?tabletop`.");
  if(!msg.guild.channels.find("name", "tabletop")){
    msg.guild.createChannel("tabletop", "text", [
      {'id': '212630495098437633', 'type': 'role', 'deny': 0, 'allow': 805829713},
      {'id': '212624757818916864', 'type': 'role', 'deny': 805449744, 'allow': 379969},
      {'id': '212631295853985792', 'type': 'role', 'deny': 805441552, 'allow': 388161},
      {'id':  msg.author.id      , 'type': 'member', 'deny': 536875024, 'allow': 268954689}]);
      return msg.channel.sendMessage("Text channal named `#tabletop` has been created. Admins please use `?tabletop` to delete the channel after use.");
    }
    else {
      if(!msg.member.roles.has(adminRole.id)) return msg.reply("Pleb, you don't have permission to use this command `?tabletop`.")
      msg.guild.channels.find("name", "tabletop").delete();
      msg.channel.sendMessage("Text channel named `#tabletop` has been deleted.");
    }
}

export function letsplay(msg,args){
  msg.delete();
  if(msg.member.roles.array().length == 1) return msg.reply("You must have at least one role to be eligible for this channel.");
  if(args.length == 0) return msg.channel.sendMessage(`@here **${msg.author.username}** would like to play a game!`);
  else return msg.channel.sendMessage(`@here **${msg.author.username}** would like to play **${args.join(" ")}**!`);
}

export function rps(msg,args){
  if(args.length == 0) return msg.reply("You did not define an argument. Usage `?rps [rock/paper/scissors]`");
   var userChoice = args[0].toLowerCase();
   var choices = ["rock", "scissors", "paper"];
   var computerChoice = choices[Math.floor(Math.random() * choices.length)];
   if(userChoice.indexof(args[0])) args[0] = "default";
     var compare = function(choice1, choice2) {
       var rock = {
         "rock" : "Its a Draw!",
         "scissors" : "Rock Wins! One point Celestial.",
         "paper" : "Paper Wins! One point -user",
         "default" : "Rock Wins! One point Celestial."
       };
       var paper = {
         "rock" : "Paper Wins! One point Celestial",
         "scissors" : "Scissors Wins! One point -user",
         "paper" : "Its a Draw!",
         "default" : "Paper Wins! One point Celestial"
       };
       var scissors = {
         "rock" : "Rock Wins! One point -user",
         "scissors" : "Its a Draw!",
         "paper" : "Scissors Wins! One point Celestial",
         "default" : "Scissors Wins! One point Celestial"
       };

       if(choice2 == "rock") return rock[choice1];
       else if(choice2 == "scissors") return scissors[choice1];
       else if(choice2 == "paper") return paper[choice1];
       else return "You did not define an argument. Usage `?rps [rock/paper/scissors]`";
     };

     msg.reply(compare(userChoice,computerChoice).replace("-user", msg.author.username));
}
