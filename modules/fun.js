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
