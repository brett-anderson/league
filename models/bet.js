var mongoose = require('mongoose'),
    moment   = require('moment'),
    Schema   = mongoose.Schema;

var betSchema = new Schema({
  title: String,
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  participants: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    bettingFor: {type: Boolean, required: true}
  }],
  createdAt: {type: Date, default: Date.now},
  expires: Date,
});

betSchema.statics.addBet = function(bet, cb) {

}



module.exports = mongoose.model('Bet', betSchema);

