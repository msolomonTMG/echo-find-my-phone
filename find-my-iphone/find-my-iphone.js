'use strict';
const icloud = require("find-my-iphone").findmyphone;
icloud.apple_id = process.env.TEST_ICLOUD_EMAIL;
icloud.password = process.env.TEST_ICLOUD_PASSWORD;

var functions = {
  alertDevice: function(device) {
    return new Promise(function(resolve, reject) {
      icloud.alertDevice(device.id, function(err) {
        console.log("Beep Beep!");
        if (!err) {
          return resolve(true)
        } else {
          return reject(false)
        }
      });
    })
  },
  getDeviceLocation: function(device) {
    return new Promise(function(resolve, reject) {
      icloud.getLocationOfDevice(device, function(err, location) {
        if (!err) {
          return resolve(location)
        } else {
          return reject(err)
        }
      });
    })
  },
  getDevices: function() {
    return new Promise(function(resolve, reject) {
      icloud.getDevices(function(err, devices) {
        if (!err) {
          return resolve(devices)
        } else {
          return reject(err)
        }
      });
    })
  },
  getDeviceByModel: function(model) {
    return new Promise(function(resolve, reject) {
      icloud.getDevices(function(err, devices) {
        if (!err) {
          devices.forEach(function(device, index){
            if (device.modelDisplayName.match(model)) {
              return resolve(device)
            } else if (devices.length === index + 1) {
              return reject('No device matched')
            }
          })
        } else {
          return reject(err)
        }
      });
    })
  },
  getDrivingTimeToDevice: function(device, myLatitude, myLongitude) {
    return new Promise(function(resolve, reject) {
      icloud.getDistanceOfDevice(device, myLatitude, myLongitude, function(err, result) {
        if (!err) {
          return resolve(result.duration.text)
        } else {
          return reject(err)
        }
      });
    })
  },
  getDistanceOfDevice: function(device, myLatitude, myLongitude) {
    return new Promise(function(resolve, reject) {
      icloud.getDistanceOfDevice(device, myLatitude, myLongitude, function(err, result) {
        if (!err) {
          return resolve(result.distance.text)
        } else {
          return reject(err)
        }
      });
    })
  }
}

module.exports = functions;
