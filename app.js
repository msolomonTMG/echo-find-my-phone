'use strict';

const
	bodyParser = require('body-parser'),
	express = require('express'),
	echo = require('./echo'),
	https = require('https'),
	request = require('request'),
	findMyIphone = require('./find-my-iphone');

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());

function getDeviceInfo(device) {
	return new Promise(function(resolve, reject) {
		if (device.match(/mac\s?book/gi)) {
			return resolve({ type: 'Apple', model: 'MacBook' })
		} else if (device.match(/i\s?Phone/gi)) {
			return resolve({ type: 'Apple', model: 'iPhone'})
		} else if (device.match(/i\s?Pad/gi)) {
			return resolve({ type: 'Apple', model: 'iPad'})
		} else {
			return reject('Device unknown')
		}
	})
}

app.post('/api/v1/echo', function(req, res) {
	console.log(req.body)
	let intent = req.body.request.intent
	console.log(intent)
		let requestDevice = req.body.request.intent.slots.Device.value
		getDeviceInfo(requestDevice).then(deviceInfo => {
			if (deviceInfo.type === "Apple") {
				findMyIphone.getDeviceByModel(deviceInfo.model).then(device => {

					if (intent.name === 'FindMyDevice') {
						findMyIphone.getDeviceLocation(device).then(location => {
							echo.formatResponse("Your " + deviceInfo.model + " is at " + location + ". Would you like me to ring it?")
								.then(response => {
									res.send(response)
								})
						})
					} else if (intent.name === 'AlertMyDevice') {
						findMyIphone.alertDevice(device).then(success => {
							echo.formatResponse("I'm alerting your " + deviceInfo.model + " now.")
								.then(response => {
									res.send(response)
								})
						}).catch(err => {
							res.sendStatus(500)
						})
					}

				})
			}
		}).catch(err => {
			console.log(err)
			res.sendStatus(500)
		})
})

function verifyRequestSignature(req, res, buf) {
	let requestedAppId = req.body.session.application.applicationId
	let thisAppId = app.set('port', process.env.ECHO_APP_IP);
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
