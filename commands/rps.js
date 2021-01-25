module.exports = {
	name: "rps",
  	aliases: ["rps", "rockpaperscissors"],
 	description: "This command will play rock paper scissors with the bot.",
	permissionsBot: [],
	permissionsUser: [],
	channels: ["text", "dm"],
	cooldown: 1,
	usage: "rps [item]",
	examples: ["rps rock", "rps scissor", "rps paper"],
	enable: true,
	deleteCmd: -1,
	deleteResp: -1,
	execute(base, prefix, msg, args) {
		if (args.length == 0) return base.utils.noArgsFound(msg, prefix, this);
		let userChoice = args[0].toLowerCase();
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
		let message = compare(computerChoice, userChoice).replace("$user", base.msg.author.username).replace("$bot", base.bot.user.username);
		base.utils.sendEmbed(msg, messsage);
	}
};
