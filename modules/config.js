function setGame(msg, args) {
 if(config.admin_id.indexOf(msg.author.id) == -1){
   return;
 }
 if(!msg.user.hasRole(adminRole)) {
   return msg.reply("You pleb, you don't have permission to use this command `${config.prefix}setGame`."); //insult unauthorized user
 }
 else if(args.length < 1) {
   msg.channel.sendMessage("You did not define an argument. Usage: `${config.prefix}setGame [game]`"); //check for game
   return deleteAfterTime(msg, 5000, 2);
 }
 try{
   msg.channel.sendMessage("Game is being set, please wait ...");
   bot.user.setGame(args.join(" "));
 }
 catch(e){
   msg.channel.sendMessage(`${e}`);
   console.log(e);
 }
 deleteAfterTime(msg, 5000, 2);
}

function setPrefix(msg, args){
 if(!msg.user.hasRole(adminRole)) {
   return msg.reply("You pleb, you don't have permission to use this command `${config.prefix}setPrefix`."); //insult unauthorized user
 }
 else if(args.length < 1) {
   msg.channel.sendMessage("You did not define an argument. Usage: `${config.prefix}setPrefix [prefix]`"); //check for game
   return deleteAfterTime(msg, 5000, 2);
 }
 try {
   msg.channel.sendMessage("Prefix being changed please wait...");
   config.prefix = args[0];
 }
 catch(e) {
   msg.channel.sendMessage(`${e}`);
   console.log(e);
 }
}

function setWelcome(msg, args) {
 if(!msg.user.hasRole(adminRole)) {
   return msg.reply("You pleb, you don't have permission to use this command `${config.prefix}setWelcome`."); //insult unauthorized user
 }
 else if(args.length < 1) {
   msg.channel.sendMessage("You did not define an argument. Usage: `${config.prefix}setWelcome [message]`"); //check for game
   return deleteAfterTime(msg, 5000, 2);
 }
 try {
   msg.channel.sendMessage("Welcome message being changed please wait...");
   let dmTag = "--dm";
   if(args.indexOf(dmTag) != -1){
     config.welcome_pm = removeElement(args, dmTag).join(" ");
   }
   else {
     config.welcome_msg = args.join(" ");
   }
 }
 catch(e) {
   msg.channel.sendMessage(`${e}`);
   console.log(e);
 }
}

function setGoodbye(msg, args) {
 if(!msg.user.hasRole(adminRole)) {
   return msg.reply("You pleb, you don't have permission to use this command `${config.prefix}setGoodbye`."); //insult unauthorized user
 }
 else if(args.length < 1) {
   msg.channel.sendMessage("You did not define an argument. Usage: `${config.prefix}setGoodbye [message]`"); //check for game
   return deleteAfterTime(msg, 5000, 2);
 }
 try {
   msg.channel.sendMessage("Goodbye message being changed please wait...");
   config.goodbye_pm = args.join(" ");
 }
 catch(e) {
   msg.channel.sendMessage(`${e}`);
   console.log(e);
 }
}

exports.set = (PREFIX, msg, bot, auth, config) => {
  let args = msg.content.trim().split(/ +/g).slice(1);
  if(args.length < 3){
    return msg.channel.sendMessage(`You did not define an argument. Usage: \`${PREFIX}set [game/goodbye/name/prefix/welcome] [value]\``);
  }
  else if(args[0].toLowerCase().startsWith("game")){
    setGame(PREFIX, msg, args);
  }
  else if(args[0].toLowerCase().startsWith("prefix")){
    setPrefix(PREFIX, msg, args);
  }
  else if(args[0].toLowerCase().startsWith("goodbye")){
    setGoodbye(PREFIX, msg, args);
  }
  else if(args[0].toLowerCase().startsWith("welcome")){
    setWelcome(PREFIX, msg, args);
  }
}

exports.eval = (PREFIX, msg, bot) => {

}

exports.statusBot = (PREFIX, msg, bot) => {

}
