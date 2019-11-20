module.exports = function(base) {
  if (base.cmd.name == "prisolis") return prisolis(base);
}

function prisolis(base) {
  let channelName = "Story Time w/ Mr.Z";
  // if (base.msg.guild.id != 212624757818916864) return;
  if (base.utils.checkPerm(base, base.msg.guild.me).length != 0) {
    return `Please give ${base.msg.guild.me.user} the following permissions: \`${base.cmd.permission}\`. In order to run the **${base.cmd.name}** command.`;
  } else if (base.msg.author.id != 222883669377810434 && base.utils.checkPerm(base, base.msg.member).length != 0) {
    return base.utils.unauthorizedUser(base);
  }
  let storyTime = base.msg.guild.channels.find(c => c.name == channelName);
  if (!storyTime) {
    base.msg.guild.createChannel(channelName, {
        type: 'voice',
        permissionOverwrites: [{
          id: base.msg.guild.id,
          deny: [],
          allow: ["CREATE_INSTANT_INVITE", "VIEW_CHANNEL", "CONNECT", "SPEAK"]
        },{
          id: 222883669377810434,
          deny: [],
          allow: ["MANAGE_CHANNELS", "MOVE_MEMBERS", "PRIORITY_SPEAKER", "MUTE_MEMBERS", "USE_VAD", "MANAGE_ROLES"]
        }]
      })
      .then(console.log)
      .catch(console.error);
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
    return `Voice channel named \`${channelName}\` has been deleted.`;
  }
};
