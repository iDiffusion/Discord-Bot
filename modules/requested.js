exports.prisolis = (base) => {
  let channelName = "Story Time w/ Mr.Z";
  if (base.msg.guild.id != 212624757818916864) { // limit to one guild
    return;
  } else if (!checkBotPerm(base, base.cmd.permission, base.cmd.name)) { // check if bot has permission
    return;
  } else if (base.msg.author.id != 222883669377810434 && !checkUserPerm(base, base.cmd.permission, base.cmd.name)) { // check if user has permission
    return;
  } else if (!checkCmdChat(base)) { // check if in command channel
    return;
  }
  let storyTime = base.msg.guild.channels.find(c => c.name == channelName);
  if (!storyTime) {
    base.msg.guild.createChannel(channelName, "voice", [
      {'id': base.msg.guild.id, 'type': 'role', 'deny': 838860816, 'allow': 3145729},
      {'id': '222883669377810434', 'type': 'member', 'deny': 536870928, 'allow': 334495745}
    ]);
    sendMessage(base.msg.channel,`Voice channel named \`${channelName}\` has been created. Use \`?prisolis\` to delete the channel after use.`);
  } else {
    let mem_array = storyTime.members.array();
    try {
      let moveToChannel = base.msg.guild.channels.find("name", "General");
      mem_array.map(id => base.msg.guild.member(id).setVoiceChannel(moveToChannel).catch(console.error));
    } catch (e) {
      //TODO move to first voice channel
    }
    storyTime.delete().catch(console.error);
    sendMessage(base.msg.channel, `Voice channel named \`${channelName}\` has been deleted.`);
  }
};
