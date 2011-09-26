var events = require('events'),
    util = require('util');

var UserDirectory = exports.UserDirectory = function() {
    // temporary store
    this.store = {};
};

util.inherits(UserDirectory, events.EventEmitter);

UserDirectory.prototype.create = function(userid, details, callback) {
    this.store[userid] = details;

    callback(null, details);
};

UserDirectory.prototype.find = function(userid, callback) {
    callback(null, this.store[userid]);
};

UserDirectory.prototype.findOrCreate = function(userid, details, callback) {
    var directory = this;

    // find the user, if found fire the callback
    this.find(userid, function(err, user) {
        // if we found the user then fire the callback
        if (user) {
            callback(null, user);
        }
        // otherwise, if we encountered an error report the error
        else if (err) {
            callback(err);
        }
        // otherwise, create the user
        else {
            directory.create(userid, details, callback);
        } // if..else
    });
}; // findOrCreate