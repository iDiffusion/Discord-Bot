exports.choices = (base) => {
  let args = base.args.slice(1).join(" ").split(",");
  if (args.length == 0) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
  let result = args.random();
  return `I choose **${result}**.`;
}

exports.coinFlip = (base) => {
  let choices = ["Head", "Tail"];
  let result = choices.random();
  return `Result is ${result}.`;
}

exports.rps = (base) => {
  if (base.args.length == 1) {
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
  var userChoice = base.args[1].toLowerCase();
  var choices = ["rock", "paper", "scissors"];
  var computerChoice = choices.random();
  userChoice = choices.indexOf(userChoice) != -1 ? userChoice : "default";
  var compare = function(choice1, choice2) {
    var rock = {
      "rock": "Its a Draw!",
      "scissors": "Rock Wins! One point $bot.",
      "paper": "Paper Wins! One point $user.",
      "default": "Rock Wins! One point $bot."
    };
    var paper = {
      "rock": "Paper Wins! One point $bot.",
      "scissors": "Scissors Wins! One point $user.",
      "paper": "Its a Draw!",
      "default": "Paper Wins! One point $bot."
    };
    var scissors = {
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
}

exports.reverse = (base) => {
  let args = base.args.slice(1).join(" ").split("");
  args.reverse();
  return `Your message reversed is **${args.join("")}**.`;
}

exports.rolldice = (base) => {
  let args = base.args.slice(1);
  let numLimit = 10;
  let sideLimit = 100;
  try {
    if (args[0].indexOf('d') != -1) {
      args = args.join(" ").split('d');
    } else {
      args.push("6");
    }
    var valArray = [];
    args[0] = args[0] < numLimit ? args[0] : numLimit;
    for (i = 1; i <= args[0]; i++) { //repeat for the number of die
      args[1] = args[1] < sideLimit ? args[1] : sideLimit;
      let tempVal = Math.floor(Math.random() * args[1]) + 1;
      if (tempVal == args[1] + 1) { //check for outofbounds case
        tempVal = args[1];
      }
      valArray.push(tempVal);
    }
    let sum = valArray.reduce((total, current) => current += total);
    let average = Math.round(sum / valArray.length * 100) / 100;
    return `Your rolls are \`${valArray.join(", ")}\` \n The sum is **${sum}** and the average is **${average}**.`;
  } catch (err) {
    return console.log(err);
    return `You did not define an argument. Usage: \`${base.PREFIX + base.cmd.format}\``;
  }
}
