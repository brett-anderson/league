var mongoose = require('mongoose');

module.exports = mongoose.model('Bet',{
  id: String,
  _creator: { type: Number, ref: 'User' },
  title: String,
  positiveBetters: [{ type: Number, ref: 'Person' }],
  negativeBetters : [{ type: Number, ref: 'Person' }],
  positiveBet: Number,
  negativeBet: Number,
  createdAt: {type: Date, default: Date.now}
});