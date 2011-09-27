var everyauth = require('everyauth'),
    UserDirectory = require('./lib/usermanager').UserDirectory;
    
exports.install = function(mesh, instance) {
    // initialise the user directory
    var users = this.users = new UserDirectory(this);

    // ensure we have auth details configured
    this.auth = this.auth || {};
    
    // flag everyauth debug on or off
    everyauth.debug = this.debugAuth;
    
    // install the global module error handler
    everyauth.everymodule.moduleErrback(function (err) {
        mesh.log('Error encountered when authenticating: ' + (err.stack || err), 'error');
    });
    
    // patch everymodule into the user directory
    everyauth.everymodule.findUserById(function(userid, callback) {
        users.find(userid, callback);
    });
    
    // iterate through the auth configurations and 
    // if we have an initializer then initialize
    for (var authType in this.auth) {
        try {
            var initFn = require('./lib/authenticators/' + authType);
            initFn.call(this, everyauth, this.auth[authType], mesh, instance);
        }
        catch (e) {
            mesh.log('No authentication support for ' + authType);
        } // try..catch
    } // for

    // wire up everyauth
    instance.use(everyauth.middleware());
    
    // add the everyauth helpers
    everyauth.helpExpress(instance);
    
    // check the design doc for this addin
    this.loadDesigns(mesh, __dirname);
};

exports.prereqs = ['couch', 'sessions'];