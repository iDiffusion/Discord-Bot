
exports.prune = (msg) => {
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
}
