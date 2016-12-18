'use strict';

var helpers = {

}

var functions = {
  formatResponse: function(speech) {
    return new Promise(function(resolve, reject) {
      return resolve({
        version: 1.0,
        sessionAttributes: {},
        response: {
          shouldEndSession: true,
          outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + speech + "</speak>"
          }
        }
      })
    })
  }
}

module.exports = functions;
