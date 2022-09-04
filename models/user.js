const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: String,
    password: String
});

// UserSchema.methods.authenticate = function(password) {
//     return this.password === this.hashPassword(password);
// }

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');