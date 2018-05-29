const functions = require('firebase-functions');

var connectedDevices = [
  {
    "id": "1",
    "type": "action.devices.types.LIGHT",
    "traits": [
      "action.devices.traits.OnOff",
      "action.devices.traits.Brightness"
    ],
    "name": {
      "name": "living room main light"
    },
    "willReportState": false
  }, {
    "id": "2",
    "type": "action.devices.types.LIGHT",
    "traits": [
      "action.devices.traits.OnOff",
      "action.devices.traits.Brightness"
    ],
    "name": {
      "name": "dining room light"
    },
    "willReportState": false
  }
];

var deviceStates = [
  {
    "id": "1",
    "state": {
      "on": false
    }
  }, {
    "id": "2",
    "state": {
      "on": true
    }
  }
];

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

  // Parse the request and see which command it is
  const intent = request.body.inputs[0].intent;
  const requestId = request.body.requestId;

  console.log("Received command: " + intent + ", requestId: " + requestId);

  var responseJson =
    {
      "requestId": requestId,
      "payload": {
      }
    }
  ;

  if (intent === "action.devices.SYNC") {
    // https://developers.google.com/actions/smarthome/create-app#actiondevicessync

    responseJson["payload"] = {"devices": connectedDevices};
  } else if (intent === "action.devices.QUERY") {
    // https://developers.google.com/actions/smarthome/create-app#actiondevicesquery
    responseJson["payload"] = {"devices": {}}

    const queriedDevices = request.body.inputs[0].payload.devices;

    for (var i = 0; i < queriedDevices.length; ++i) {
      console.log("Query the state of device " + queriedDevices[i].id);

      for (var j = 0; j < deviceStates.length; ++j) {
        if (deviceStates[j].id === queriedDevices[i].id) {
          console.log("Found matched device " + deviceStates[j].id);

          //responseJson["payload"]["devices"] = {}
          responseJson["payload"]["devices"][deviceStates[j].id] = deviceStates[j].state;

          break;
        }
      }
    }
  } else if (intent === "action.devices.EXECUTE") {
    // https://developers.google.com/actions/smarthome/create-app#actiondevicesexecute

    const commands = request.body.inputs[0].payload.commands;

    for (var i = 0; i < commands.length; ++i) {
      console.log("Command[" + i + "]: " + commands[i].execution[0].command);

      var successfulDeviceIds = [];
      var failedDeviceIds = [];

      var turningOn = null;

      if (commands[i].execution[0].command === "action.devices.commands.OnOff") {
        turningOn = commands[i].execution[0].params.on;
      }

      const targetedDevices = commands[i].devices;
      for (var j = 0; j < targetedDevices.length; ++j) {
        console.log("On device " + targetedDevices[j].id);

        // TODO: Try to execute the command on these devices. Assume it was
        // successful.
        //
        // DoSomething();
        //
        //

        for (var k = 0; k < deviceStates.length; ++k) {
          if (deviceStates[k].id === targetedDevices[j].id) {

            successfulDeviceIds.push(targetedDevices[j].id);
            console.log("Found a matched device");

            break;
          }
        }
      }

      var responseCommands = [];

      if (successfulDeviceIds.length > 0) {
        responseCommands.push({
          "ids": successfulDeviceIds,
          "status": "SUCCESS",
          "states": {
            "on": true
          }
        });
      }

      if (failedDeviceIds.length > 0) {
        responseCommands.push({
          "ids": failedDeviceIds,
          "status": "ERROR"
        });
      }

      // Assign back to the response
      responseJson["payload"]["commands"] = responseCommands;
    }
  } else {
    console.warn("Unknown command");
  }

  response.status(200).json(responseJson);
});

