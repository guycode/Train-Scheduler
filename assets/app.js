$(document).ready(function () {

    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCYFkfBs3OFESEaSGBH5tmHXnEC0c7lbeA",
    authDomain: "train-scheduler-5666d.firebaseapp.com",
    databaseURL: "https://train-scheduler-5666d.firebaseio.com",
    projectId: "train-scheduler-5666d",
    storageBucket: "train-scheduler-5666d.appspot.com",
    messagingSenderId: "889246297251"
  };
  firebase.initializeApp(config);
  
    var database = firebase.database();
  
    // Capture Button Click
    $("#addTrain").on("click", function (event) {
      event.preventDefault();
  
      // Grabbed values from text boxes
      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var freq = $("#interval").val().trim();
  
      // Code for handling the push
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq
      });
    });
  
  
    database.ref().on("child_added", function (childSnapshot) {
  
      var newTrain = childSnapshot.val().trainName;
      var newLocation = childSnapshot.val().destination;
      var newFirstTrain = childSnapshot.val().firstTrain;
      var newFreq = childSnapshot.val().frequency;
  
      // First Time (pushed back 1 year to make sure it comes before current time)
      var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
  
      // Current Time
      var currentTime = moment();
  
      // Difference
      var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  
      // Time apart (remainder)
      var tRemainder = diffTime % newFreq;
  
      // Minute(s) Until Train
      var tMinTillTrain = newFreq - tRemainder;
  
      // Next Train
      var nextTrain = moment().add(tMinTillTrain, "minutes");
      var catchTrain = moment(nextTrain).format("HH:mm");
  
      // Display On Page
      $("#main-display").append(
        ' <tr><td>' + newTrain +
        ' </td><td>' + newLocation +
        ' </td><td>' + newFreq +
        ' </td><td>' + catchTrain +
        ' </td><td>' + tMinTillTrain + ' </td></tr>');
  
      // Clear input fields
      $("#trainName, #destination, #firstTrain, #interval").val("");
      return false;
    },
      //Handle the errors
      function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
  
  });
  