const express= require("express");
const bodyParser= require("body-parser"); 
 
const app= express();
app.set("view engine", "ejs");  // to read .ejs file
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var taskArr=[]; //stores array of tasks created during post request
// This should be accessed by both post & gets, post will store info in arr, gets will render it via EJS
//thats why I made it global array

app.get("/", function(req, res){
    /*
    var month= today.getMonth(); // return array index: 0->jan, 11->dec
    var todayDate= today.getDate(); //return actual date [1-31]
    var year= today.getFullYear(); //return acyual year
    var hour= today.getHours();  // return actual hour in 24 hour format
    var min= today.getMinutes(); // return actual min
    var sec= today.getSeconds(); // return actual sec
    var day= today.getDay(); // raturn array index: // Sunday - Saturday : 0 - 6
    console.log("month: "+month);
    console.log("date: "+todayDate);
    console.log("Year: "+year);
    console.log("hour: "+hour);
    console.log("min: "+min);
    console.log("sec: "+sec);
    console.log("day: "+day);

    ------------Another Way------------
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    console.log(today.toLocaleDateString("en-US")); // 9/17/2016
    console.log(today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016
    console.log(today.toLocaleDateString("hi-IN", options)); // शनिवार, 17 सितंबर 2016
    */

    /*
    var DayArray=["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturaday"];
    var todayDay=DayArray[today.getDay()];

    //now depending on today:, I want my HTML(ejs) to change TypeOfDay & TodaysDay
    if(today.getDay()===6 || today.getDate()===0){
        day= "Weekend";
        //res.send("Its weekend");
        res.render("list", {TypeOfDay: day, TodaysDay: todayDay});
    }
    else{
        day= "Weekday"
        //res.send("oh fuck! its a work day");
        res.render("list", {TypeOfDay: day, TodaysDay: todayDay});
    }
    */

    let localDayDescription;

    function calcTime(city, offset) {

        // create Date object for current location
        d = new Date();
       
        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
       
        // create new Date object for different city
        // using supplied offset
        nd = new Date(utc + (3600000*offset));
       
        let hour = nd.getHours();
        let min = nd.getMinutes();
        let options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        };
        let dayDescription = nd.toLocaleDateString("en-us", options);
        
        
        let dateTime={
            hour: hour,
            min: min,
            dayDescription: dayDescription
        }
        // return time as a string
        return dateTime
    
    }
    localDayDescription=calcTime('Kolkata', '+5.5').dayDescription;

    res.render("list", {localDayDescription: localDayDescription, newToDo: taskArr });  //as taskArr is empty, it wont add any new task
    // see here I had passed an array as newToDo
});

app.post("/",function(req, res){
    var task= req.body.newTask; // newly added task from client
    taskArr.push(task); //push task into global array
    res.redirect("/"); // VVI: redirect to root (get), so that it can finally render the updated taskArr
});

app.post("/reset", function(req,res){
    taskArr=[]; //empty task array
    res.redirect("/");
});

/*
Summery: client make get req (line 13), date updated, say client add tsk1 (post req, L71), arr=[task1]; redirect to root (get),
it render date, & newToDo as an array, went to list.ejs, run loop 1 times, added 1 li named task1 (task 4 of list, (as 3 were added default))
Now client add another task2 (post), arr=[tsk1, tsk2], redirect to get, get render newToDo as arr of 2 Element. went to list.js, run loop twice,
(after default 3 task, loop run 2X, two li made) [indirectly, edit 4th li by 4th & 5th li]. (appears as only 5th li gets added, but its not the case).
*/

app.listen(process.env.PORT || 3000, function(req, res){
    console.log("Local server has been created at port 3000");
});