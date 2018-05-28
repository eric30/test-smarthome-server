const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

  const sampleData = `
    {
      "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
      "inputs": [{"intent": "action.devices.SYNC"}]
    }
  `;

  //var parsedSampleData = JSON.parse(sampleData);
  //console.log("Sample data: " +  parsedSampleData.requestId);

  // Parse the request and see which command it is
  const command = request.body.inputs[0].intent;

  if (command === "action.devices.SYNC") {
    console.log("A SYNC command");
  } else if (command === "action.devices.QUERY") {
    console.log("A QUERY command");
  } else if (command === "action.devices.EXEC") {
    console.log("A EXEC command");
  } else {
    console.warn("Unknown command: " + command)
  }

  response.status(200).json(`
    {
      "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
      "payload": {
        "agentUserId": "123456",
        "devices": []
      }
    }
  `);
});
