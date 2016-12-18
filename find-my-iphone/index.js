var findMyIphone = require('./find-my-iphone')

module.exports = {
  alertDevice: findMyIphone.alertDevice,
  getDevices: findMyIphone.getDevices,
  getDeviceByModel: findMyIphone.getDeviceByModel,
  getDeviceLocation: findMyIphone.getDeviceLocation,
  getDrivingTimeToDevice: findMyIphone.getDrivingTimeToDevice
}
