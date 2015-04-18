var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    bcrypt   = require('bcrypt'),
    require('mongoose-moment')(mongoose),

    SALT_WORK_FACTOR = 10;
 
var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
    bets : [{ type: Schema.Types.ObjectId, ref: 'Bet' }]
});

var BetSchema = new Schema({
  _creator: { type: Number, ref: 'User' },
  title: String,
  positiveBetters: [{ type: Number, ref: 'Person' }],
  negativeBetters : [{ type: Number, ref: 'Person' }],
  positiveBet: Number,
  negativeBet: Number,
  createdAt: {type: Date, default: Date.now},
})


var Story  = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);