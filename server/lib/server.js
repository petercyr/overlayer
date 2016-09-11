var app = require('express')();
var router = require('express').Router();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Watcher = require('./watcher');
var _ = require('lodash');
var fs = require('fs');

var DIST_ROOT = path.resolve(__dirname + '/../../client');

function overlayerServer() {
  this._socket = null;
  this._watcher = new Watcher();
  this._data = {};

  _.bindAll(this, [
    '_handleFileUpdates'
  ]);
};

overlayerServer.prototype.init = function() {
  // Load label-data file watcher
  this._watcher.init();

  this._watcher.on('update', this._handleFileUpdates);

  // Load routers
  app.use('/overlay', require('./routers/overlay'));

  // Init http server
  http.listen(3000, function() {
    console.log('listening on *:3000');
  });

  // Init socket server
  io.on('connection', function(socket){
    console.log('user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
};

overlayerServer.prototype._handleFileUpdates = function(file) {
  console.log('overlayServer says this updated: ', file);
  console.log('hehe');

  var content = fs.readFileSync(file, {
    encoding: 'UTF-8',
    flag: 'r'
  });

  var oldData = _.cloneDeep(this._data);

  _.set(this._data, dataMapping[path.basename(file)], content);

  console.log('newData: ', this._data);

  // Only emit if there's a diff
  if (!_.isEqual(this._data, oldData)) {
    io.emit('newData', this._data);
  }
};

module.exports = overlayerServer;

var dataMapping = {
  '30day_donation_amount.txt': '30day.donationAmount',
  '30day_top_donations.txt': '30day.topDonations',
  '30day_top_donator.txt': '30day.topDonator',
  '30day_top_donators.txt': '30day.topDonators',

  'all_time_top_donations.txt': 'allTime.topDonations',
  'all_time_top_donator.txt': 'allTime.topDonator',
  'all_time_top_donators.txt': 'allTime.topDonators',

  'donation_goal.txt': 'donationGoal',

  'donationtrain_clock.txt': 'donationTrain.clock',
  'donationtrain_counter.txt': 'donationTrain.counter',
  'donationtrain_latest_amount.txt': 'donationTrain.latestAmount',
  'donationtrain_latest_donator.txt': 'donationTrain.latestDonator',
  'donationtrain_total_amount.txt': 'donationTrain.totalAmount',

  'followtrain_clock.txt': 'followTrain.clock',
  'followtrain_counter.txt': 'followTrain.counter',
  'followtrain_latest_follower.txt': 'followTrain.latestFollower',

  'monthly_donation_amount.txt': 'monthly.donationAmount',
  'monthly_top_donations.txt': 'monthly.topDonations',
  'monthly_top_donator.txt': 'monthly.topDonator',
  'monthly_top_donators.txt': 'monthly.topDonators',

  'most_recent_donator.txt': 'mostRecent.donator',
  'most_recent_follower.txt': 'mostRecent.follower',
  'most_recent_subscriber.txt': 'mostRecent.subscriber',

  'session_donation_amount.txt': 'session.donationAmount',
  'session_donators.txt': 'session.donators',
  'session_follower_count.txt': 'session.followerCount',
  'session_followers.txt': 'session.followers',
  'session_most_recent_donator.txt': 'session.mostRecentDonator',
  'session_most_recent_follower.txt': 'session.mostRecentFollower',
  'session_most_recent_subscriber.txt': 'session.mostRecentSubscriber',
  'session_subscriber_count.txt': 'session.subscriberCount',
  'session_subscribers.txt': 'session.subscribers',
  'session_top_donations.txt': 'session.topDonations',
  'session_top_donator.txt': 'session.topDonator',
  'session_top_donators.txt': 'session.topDonators',

  'subtrain_clock.txt': 'subTrain.clock',
  'subtrain_counter.txt': 'subTrain.counter',
  'subtrain_latest_sub.txt': 'subTrain.latestSub',

  'total_donation_amount.txt': 'total.donations',
  'total_follower_count.txt': 'total.followers',
  'total_subscriber_count.txt': 'total.subscriberCount',

  'weekly_donation_amount.txt': 'weekly.donations',
  'weekly_top_donations.txt': 'weekly.topDonations',
  'weekly_top_donator.txt': 'weekly.topDonator',
  'weekly_top_donators.txt': 'weekly.topDonators'
};


