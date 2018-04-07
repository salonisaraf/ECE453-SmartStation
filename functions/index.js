/**
 * This file contains the definitions of cloud functions within the web
 * application.
 */

const functions = require('firebase-functions');

//Pulls in dependencies to be able to login as the admin
const admin = require('firebase-admin');

/**
 * Load modules associated with moment. Moment is a library for parsing and
 * printing strings.
 */
const moment = require('moment');

//This allows us to access firebase
admin.initializeApp(functions.config().firebase);

/**
 * This callback function creates an entry into our database to mark the start
 * of a user session. This information is stored in the app as states (on
 * and off) which will be triggered by a sliding switch on the DE1-SoC.
 * @type state on/off DE1-SoC turns on/off associated hardware and marks the
 * beginning and end of a user session.
 */

//onRequest is an event handler which contains information about the request
// and is run every time an https URL is hit. This what executes when a GET
// request is issued. This the GET request handler.
 exports.toggle = functions.https.onRequest((request, response) => {
  //state stores the current state of the toggle. Default state is set to false.
  var state = request.query.state || "off";
  var sessionsRef = admin.database().ref("/sessions");

//If switch is on, create a new entry with new start time
  if(state == "on"){
   //sessionsRef.push({startTime: moment().valueOf()});
   //response.send("Switched on!");

   sessionsRef.orderByKey().limitToLast(1).once("value", function(snapshot){
    if(Object.keys(snapshot.val()).length == 0){
     //Error case since database is empty so no existing entry to modify
     response.send("Switched off!");
     return;
    }
    //Get the latest session entry's key
    var key = Object.keys(snapshot.val())[0];
    //Get the current session
    var currEntry = snapshot.val()[key];
    //Update the end time of the current session. By default, moment gives
    // time that we need to format on the front end
    var start = Date.now();
    currEntry.startTime = moment(start).subtract(5, 'hours').format('h:mm:ss a');
    currEntry.sessionDate = moment(start).subtract(5, 'hours').format('LL');
    //Update the end time in the database
    sessionsRef.child(key).set(currEntry);
    response.send("Session started!");
   });
  }else{

//If switch is off, modify latest existing entry
   sessionsRef.orderByKey().limitToLast(1).once("value", function(snapshot){
    if(Object.keys(snapshot.val()).length == 0){
     //Error case since database is empty so no existing entry to modify
     response.send("Switched off!");
     return;
    }
    //Get the latest session entry's key
    var key = Object.keys(snapshot.val())[0];
    //Get the current session
    var currEntry = snapshot.val()[key];
    //Update the end time of the current session. By default, moment gives
    // time that we need to format on the front end
    var end = Date.now();
    currEntry.endTime = moment(end).subtract(5, 'hours').format('h:mm:ss a');
    //Update the end time in the database
    sessionsRef.child(key).set(currEntry);
    response.send("Session ended!");
   });
  }
 });