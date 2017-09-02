// const secrets = require('../../secrets.js');
const secrets = {};
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const googleStrategy = new GoogleStrategy(secrets.googleAuth, authCallback);

function authCallback(accessToken, refreshToken, profile, done){
	console.log(accessToken, refreshToken, profile, done)
	users[profile.id] = profile;
	done();
}



passport.use(googleStrategy)


// passport.serializeUser(function(user, done) {
// 	console.log('ser', user)
// 	done(null, user.id);
// });


var users = {

}

// passport.deserializeUser(function(id, done) {
// 	console.log('deser', id)
// 	done();
//   // User.findById(id, function (err, user) {
//   //   done(err, user);
//   // });
// });

module.exports = passport;