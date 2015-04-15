var express = require('express');
var router = express.Router();
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
}

module.exports = function(passport){
  router.get('/user', isAuthenticated, function(req, res){
    res.json(req.user);
  });
  router.get('/users', isAuthenticated, function(req, res){
    var callback = function(err, data) {
      if(err){
        console.log(err)
      } else {
        res.json(data);
      }
    }
    User
      .find()
      .select('username')
      .exec(callback);
  });
  return router;
}