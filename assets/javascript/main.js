// Initialize Firebase
var config = {
    apiKey: "AIzaSyAfUJ2A5PcQcBeq2Iwl2j0a02C3jkvZ_Ng",
    authDomain: "trains-5f87f.firebaseapp.com",
    databaseURL: "https://trains-5f87f.firebaseio.com",
    projectId: "trains-5f87f",
    storageBucket: "",
    messagingSenderId: "837841713221"
};
firebase.initializeApp(config);

var databaseRef = firebase.database();

//Variables
var name = "";
var destination = "";
var firstTrain = "";
var frequency = "";

//push form results
$("#submit").on("click", function() {
    event.preventDefault();

    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#train1-time").val().trim();
    frequency = $("#frequency").val().trim();

    databaseRef.ref().push({
        trainName: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });

    $("#train-name").val("");
    $("#destination").val("");
    $("#train1-time").val("");
    $("#frequency").val("");

});

//retireve child addeds from database and name it cSnapshot, then create td + tr for info and append onto table
databaseRef.ref().on("child_added", function(cSnapshot) {

    var firstTrainConvert = moment(cSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
    console.log("1st Train Converted: " + firstTrainConvert);

    var currTime = moment()
    console.log("Currently: " + currTime);

    var diffTime = moment().diff(moment(firstTrainConvert), "minutes");
    console.log("Difference: " + diffTime);

    var tRemaining = diffTime % cSnapshot.val().frequency;
    console.log("Remaining min: " + tRemaining);

    var minTilTrain = cSnapshot.val().frequency - tRemaining;
    console.log("Minutes til: " + minTilTrain);

    var nextTrain = moment().add(minTilTrain, "minutes").format("HH:mm");
    console.log("Next Train: " + nextTrain);


    //grab data from firebase and append to table
    var tableRow = $("<tr>");
    var tdName = $("<td>").text(cSnapshot.val().trainName);
    var tdDestination = $("<td>").text(cSnapshot.val().destination);
    var tdFrequency = $("<td>").text(cSnapshot.val().frequency);
    var tdArrival = $("<td>").text(nextTrain);
    var tdMinAway = $("<td>").text(minTilTrain);

    tableRow.append(tdName);
    tableRow.append(tdDestination);
    tableRow.append(tdFrequency);
    tableRow.append(tdArrival);
    tableRow.append(tdMinAway);

    $("tbody").append(tableRow);

});