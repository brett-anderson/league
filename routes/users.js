var express = require('express');
var router = express.Router();
/* GET users listing. */

router.get('/', function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.get('/:username', function(req, res, next) {
  var db = req.db,
    collection = db.get('usercollection');
  collection.find({}, {}, function(e, docs){
    res.render('userlist', {
      "userlist": docs
    });
  });
});

router.post('/', function(req, res, next) {
  res.send("Hello");
});

module.exports = router;
