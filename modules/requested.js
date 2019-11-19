exports.prisolis = (base) => {
  let channelName = "Story Time w/ Mr.Z";
  if (base.msg.guild.id != 212624757818916864) {
    return;
  } else if (!checkBotPerm(base, base.cmd.permission, base.cmd.name)) {
    return;
  } else if (base.msg.author.id != 222883669377810434 && !checkUserPerm(base, base.cmd.permission, base.cmd.name)) {
    return;
  }
  let storyTime = base.msg.guild.channels.find(c => c.name == channelName);
  if (!storyTime) {
    base.msg.guild.createChannel(channelName, {
      type: 'voice',
      permissionOverwrites: [{
        'id': base.msg.guild.id,
        'allow': ["CREATE_INSTANT_INVITE", "VIEW_CHANNEL", "CONNECT", "SPEAK"]
      }, {
        'id': 222883669377810434,
        'allow': ["MANAGE_CHANNELS", "MOVE_MEMBERS", "PRIORITY_SPEAKER", "MUTE_MEMBERS", "USE_VAD", "MANAGE_ROLES"]
      }]
    });
    return `Voice channel named \`${channelName}\` has been created. Use \`?prisolis\` to delete the channel after use.`;
  } else {
    let mem_array = storyTime.members.array();
    try {
      let moveToChannel = base.msg.guild.channels.find("name", "General");
      mem_array.map(id => base.msg.guild.member(id).setVoiceChannel(moveToChannel).catch(console.error));
    } catch (e) {
      //TODO move to first voice channel
    }
    storyTime.delete().catch(console.error);
    return base.msg.channel, `Voice channel named \`${channelName}\` has been deleted.`;
  }
};
