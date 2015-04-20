var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, require: true},
  password: {type: String, require: true},
  email: String,
  firstName: {type: String, require: true},
  lastName: {type: String, required: true},
  credits: {type: Number, default: 1000, require: true, min: 0},
  createdAt: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('User', userSchema);
