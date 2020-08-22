"use strict";

exports.log = (action, user, extras) => {
    // TODO write log function to log event to mysql
    console.log(`Timestamp: ${time()}\nAction: ${action}\nPlatform: Discord\nUser: ${user}\nNote: ${extras}`);
    return true;
};

exports.guild = (base, guild) => {
    //TODO write guild function to create guild unless exist and return data
    if (!guild) {
        return {ID: 0, Prefix: ''};
    }
    var server = base.config.find(g => guild && guild.id == g.ID);
    if (server == undefined) {
        var newGuild = {
            ID: guild.id,
            Prefix: '?'
        }
        base.config.push(newGuild);
        server = newGuild;
    }
    server.set = function set(field, value) {
        this[field] = value;
    };
    server.get = function get(field, value) {
        return this[field];
    };
    return server;
};

exports.user = (base, mem) => {
    //TODO write user function to create user unless exist and return data
    var user = base.team.find(u => mem && mem.id == u.ID);
    if( user == undefined){
        var newUser = {
            ID: mem.ID,
            Username: mem.displayName
        };
        base.team.push(newUser);
        user = newUser;
    }
    user.set = function set(field, value) {
        this[field] = value;
    };
    user.get = function get(field, value) {
        return this[field];
    }
    return user;
};

exports.gamertag = (base, mem) => {
    //TODO write gamertag function to retrieve all of a users tags
    var user = this.user( base, mem );
    return user.tags;
}
