var express = require('express');
var router = express.Router();
var User
/* GET users listing. */

router.get('/', function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.get('/:username', function(req, res, next) {
  res.write(req.params.username)
});

router.post('/', function(req, res, next) {
  var db        = req.db,
      username  = req.body.username,
      password  = req.body.password;
      // collection = db.get('usercollection');
      // console.log(db);
  // collection.insert({
  //     'username': username,
  //     'password': password
  //   }, function (err, doc) {
  //     if (err) {
  //       res.send("Oops, there was a problem with the signup process.")
  //     } else {
  //     }
  //   });
  res.render('user', {
    username: username, 
    password: password
  } )
});

module.exports = router;
