var mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , Schema = mongoose.Schema
  , SALT_WORK_FACTOR = 10
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


  // User Schema
var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true},
});


// Bcrypt middleware
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


// Password verification
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Register
module.exports = mongoose.model('User', UserSchema);