var config = require ('./configfile');
exports.passport = require('passport');
exports.facebookStrategy = require('passport-facebook').Strategy;
var database = require('../neo4jDB');



exports.passport.serializeUser(function(user, done) {
  done(null, user.id);
});

exports.passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

exports.passport.use(new exports.facebookStrategy({
 clientID: config.ids.facebook.clientID,
 clientSecret: config.ids.facebook.clientSecret,
 callbackURL: config.ids.facebook.callbackURL
},
  function(accessToken, refreshToken, profile, done) {
    findOrCreate({facebook: profile}, database.db, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  })
);

var findOrCreate = function(account, db, callback){

  var getQuery = "MATCH (u: User) WHERE u.fbUserID = " + account.facebook.id + " RETURN u";
  var createQuery = "CREATE (u: User "+
      " { fbUserID: " + account.facebook.id +
      " , fbFName: " + account.facebook.name.givenName +
      " , fbLName: " + account.facebook.name.familyName +
      " , fbEmail: " + account.facebook.emails.value + 
      " }) return u";

  db.cypherQuery(getQuery, function(err, result){
    if(result.length > 0){
      return callback(err, result[0])
    } else {
      db.cypherQuery(createQuery, function(err, result){
        return callback(err, result[0])
      })
    }

  })


};




