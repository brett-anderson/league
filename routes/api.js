var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Bet  = require('../models/bet');

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
  router.get('/bets', isAuthenticated, function(req, res){
    var callback = function(err, data) {
      if(err) {
        console.log(err);
      } else {
        res.json(data)
      }
    }
    Bet
      .find()
      .exec(callback);
  });
  router.post('/bets', isAuthenticated, function(reqest, response){

    var callback = function(err, data) {
      if(err) {
        console.log(err);
      } else {
        response.json(data);
      }
    } 
    // res.json(req.body);
    var res = {
        message: 'Bet Placed',
        code : 200
    };
    response.statusCode = 200;

    response.json(res);


  })
  return router;
}