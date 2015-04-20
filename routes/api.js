'use strict';
/* global require: false  */
/* global module: false  */
/* global console: false  */
/* global next: false  */
var express = require('express'); 
var router = express.Router(); 
var User = require('../models/user');
var Bet  = require('../models/bet');
var async = require('../bower_components/async/lib/async');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
};

module.exports = function(passport){
  router.get('/user', isAuthenticated, function(req, res){
    res.json(req.user);
  });
  router.get('/users', isAuthenticated, function(req, res){
    var callback = function(err, data) {
      if(err){
        console.log(err);
      } else {
        res.json(data);
      }
    };
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
        res.json(data);
      }
    };
    Bet
      .find()
      .populate('_creator')
      .populate('participants.user')
      .exec(callback);
  });
  router.post('/bets', isAuthenticated, function(request, response){
    var locals = {},
        user = request.user;
    locals.bet = new Bet();
    locals.bet._creator = user._id;
    locals.bet.title    = request.body.title;
    locals.bet.expires  = request.body.expires;
    locals.bet.participants = [{ 
      user: user._id, 
      amount: parseInt(request.body.amount),
      bettingFor: true,
      expires: request.expires
    }];

    var checkForCredits = function(callback) {
      if(user.credits < request.body.amount) {
        return callback(new Error('No user with name '+name+' found.'));
      }
      return callback();
    };

    var saveBet = function(callback) {
      locals.bet.save(function(err) {
        if (err){
            console.log('Error in Saving user: '+err);  
            return callback(new Error(err));
        }
        return callback();
      });
    };

    var returnJson = function(err) {
        if (err) {
          console.log(err);
          return next(err);
        }
        var cb = function(err, data) {
          if(err) {
            console.log(err);
            response.statusCode = 200;
            response.error = true;
            response.json(data);
          } 
          else {
            response.statusCode = 200;
            response.json(data);
          }
        };
        Bet
          .find()
          .populate('_creator')
          .populate('participants.user')
          .exec(cb);
    };

    async.series([ checkForCredits, saveBet ], returnJson);
  });
  return router;
};