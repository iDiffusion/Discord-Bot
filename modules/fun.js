const underscore = require("underscore");

module.exports = function(base) {
  if (base.cmd.name == "choices") return choices(base);
  else if (base.cmd.name == "coinflip") return coinflip(base);
  else if (base.cmd.name == "rps") return rps(base);
  else if (base.cmd.name == "reverse") return reverse(base);
  else if (base.cmd.name == "rolldice") return rolldice(base);
};

function choices(base) {
  let args = base.args.slice(1).join(" ").split(",").filter(s => s);
  if (args.length == 0) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  } else if (args.length == 1) {
    return `I choose **${args[0].trim()}**.`;
  } else {
    return `I choose **${underscore.sample(args).trim()}**.`;
  }
};

function coinflip(base) {
  let choices = ["Head", "Tail"];
  let result = underscore.sample(choices);
  return `Result is ${result}.`;
};

function rps(base) {
  if (base.args.length == 1) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
  let userChoice = base.args[1].toLowerCase();
  let choices = ["rock", "paper", "scissors"];
  let computerChoice = underscore.sample(choices);
  userChoice = choices.indexOf(userChoice) != -1 ? userChoice : "default";
  let compare = function(choice1, choice2) {
    let rock = {
      "rock": "Its a Draw!",
      "scissors": "Rock Wins! One point $bot.",
      "paper": "Paper Wins! One point $user.",
      "default": "Rock Wins! One point $bot."
    };
    let paper = {
      "rock": "Paper Wins! One point $bot.",
      "scissors": "Scissors Wins! One point $user.",
      "paper": "Its a Draw!",
      "default": "Paper Wins! One point $bot."
    };
    let scissors = {
      "rock": "Rock Wins! One point $user.",
      "scissors": "Its a Draw!",
      "paper": "Scissors Wins! One point $bot.",
      "default": "Scissors Wins! One point $bot."
    };
    if (choice1 == "rock") return rock[choice2];
    else if (choice1 == "scissors") return scissors[choice2];
    else if (choice1 == "paper") return paper[choice2];
    else return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  };
  return compare(computerChoice, userChoice).replace("$user", base.msg.author.username).replace("$bot", base.bot.user.username);
};

function reverse(base) {
  let args = base.args.slice(1).join(" ").split("");
  args.reverse();
  return `Your message reversed is **${args.join("")}**.`;
};

function rolldice(base) {
  let args = base.args.slice(1);
  const numLimit = 10;
  const sideLimit = 100;
  try {
    if (args[0].indexOf('d') != -1) {
      args = args.join(" ").split('d');
    } else {
      args[1] = "6";
    }
    let valArray = [];
    args[0] = args[0] < numLimit ? args[0] : numLimit;
    args[1] = args[1] < sideLimit ? args[1] : sideLimit;
    for (i = 1; i <= args[0]; i++) { //repeat for the number of die
      let tempVal = Math.floor(Math.random() * args[1]) + 1;
      if (tempVal > args[1]) { //check for outofbounds case
        tempVal = args[1];
      }
      valArray.push(tempVal);
    }
    let sum = valArray.reduce((total, current) => current += total);
    let average = Math.round(sum / valArray.length * 100) / 100;
    return `Your rolls are \`${valArray.join(", ")}\` \n The sum is **${sum}** and the average is **${average}**.`;
  } catch (err) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
};
