var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//we declare the desired user schema
var UserSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('User', UserSchema);