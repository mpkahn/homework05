$(document).ready(function(){

//Use moment to call current time and display at top of page
const time = moment();
$("#currentDay").text(time.format("MMMM Do YYYY, h:mm a"));
console.log(time);

//define all hour blocks within schedule object
const schedule = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": [],
};
    //setSchedule saves user input to the local storage
    //call these saved text inputs "inputs"
let setSchedule = function() {
    localStorage.setItem("inputs", JSON.stringify(schedule));
}

    // getSchedule loads the user input from the local storage
let getSchedule = function() {

    let savedInput = JSON.parse(localStorage.getItem("inputs"));
    if (savedInput) {
       let schedule = savedInput

        $.each(schedule, function(hour, schedule) {
            let hourDiv = $("#" + hour);
            createSchedule(schedule, hourDiv);
        })
    }
    //call function to ensure proper hour formatting
    auditSchedule()
}

    // add input to the correct hour row
let createSchedule = function(inputText, hourDiv) {
    let schedDiv = hourDiv.find(".input");
    let schedP = $("<p>").addClass("description").text(inputText)
    schedDiv.html(schedP);
}

    //Update row color based on if hour has passed (grey), current (green), upcoming (light blue - no change from default)
let auditSchedule = function() {
    let currentHour = moment().hour();
    $(".user-input").each(function() {
        let elementHour = parseInt($(this).attr("id"));

        if ( elementHour < currentHour ) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( elementHour === currentHour ) {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

    // adds p element to textarea element 
let replaceTextarea = function(textareaElement) {
    let schedInfo = textareaElement.closest(".user-input");
    let textArea = schedInfo.find("textarea");
    let time = schedInfo.attr("id");
    let text = textArea.val().trim();

    schedule[time] = [text];  
    setSchedule();

    createSchedule(text, schedInfo);
}

 //add ability to click on input area
$(".input").click(function() {

    // save the other tasks if they've already been clicked
    $("textarea").each(function() {
        replaceTextarea($(this));
    })

    // convert to a textarea element if row time greater than or equal to curren time (future)
    let time = $(this).closest(".user-input").attr("id");
    if (parseInt(time) >= moment().hour()) {

        let text = $(this).text();
        let textInput = $("<textarea>").addClass("form-control").val(text);

        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

// save button function
$(".saveBtn").click(function() {
    replaceTextarea($(this));
})

// update task backgrounds on the hour (converted from miliseconds -> hour)
timeInHour = 3600000 - time.milliseconds(); 
setTimeout(function() {
    setInterval(auditSchedule, 3600000)
}, timeInHour);

// call function to load saved inputs
getSchedule();
});