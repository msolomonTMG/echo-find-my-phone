'use strict';

const
  Stamplay = require("stamplay"),
  stamplay = new Stamplay(process.env.STAMPLAY_APP_ID, process.env.STAMPLAY_API_KEY);

var helpers = {
  createSession: function(session) {
    return new Promise(function(resolve, reject) {
      let sessionData = {
        session_id: session.sessionId,
        user_id: session.user.userId
      }
      stamplay.Object('session').save(sessionData, function(err, res) {
        if (!err) {
          return resolve(res)
        } else {
          return reject(err)
        }
      })
    })
  }
}

var functions = {
  getOrCreateSession: function(session) {
    return new Promise(function(resolve, reject) {
      stamplay.Object('session').get({ session_id: session.sessionId }, function(err, res) {
        if (!err) {
          if (res.data.length > 0) {
            return resolve(res.data[0])
          } else {
            helpers.createSession(session).then(session => {
              return resolve(session)
            })
          }
        } else {
          return reject(err)
        }
      })
    })
  },
  saveLatestDeviceForUser: function(sessionId, device) {
    return new Promise(function(resolve, reject) {
      stamplay.Object('session').patch(sessionId, { latest_device: device }, function(err, res) {
        if (!err) {
          return resolve(res)
        } else {
          return reject(err)
        }
      })
    })
  }
}

module.exports = functions;
