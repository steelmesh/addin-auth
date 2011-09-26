var userCache = {};

function userCreator(meshapp, mesh) {
    return function(sess, accessToken, accessSecret, twitUser) {
        var promise = this.Promise(),
            details = {
                id: 'twitter_' + twitUser.id,
                name: twitUser.name
            };
        
        // look for the user in the user directory
        meshapp.users.findOrCreate(details.id, details, function(err, user) {
            // if we have details, then fulfil the promise
            if (user) {
                promise.fulfill(user);
            }
            // otherwise, fail with a not found condition
            else {
                promise.fail(err || 'User not found, and could not be created');
            } // if..else
        });
        
        return promise;
    };
} // initUser

module.exports = function(everyauth, config, mesh, instance) {
    everyauth.twitter
        .consumerKey(config.consumerKey)
        .consumerSecret(config.consumerSecret)
        .findOrCreateUser(userCreator(this, mesh))
        .redirectPath(this.baseUrl);
};