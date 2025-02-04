let tasks = [];

function addTask() {
    let subject = document.getElementById("subject").value;
    let task = document.getElementById("task").value;
    let time = document.getElementById("time").value;
    let repeat = document.getElementById("repeat").value;
    function updateProgress() {
        // Calculate progress based on tasks and total days in a week
        let completed = tasks.length > 0 ? (tasks.length / 7) * 100 : 0;
        // Update the progress bar's value
        document.getElementById("progressBar").value = completed;
        // Update the text showing completion percentage
        document.getElementById("progressText").innerText = `${Math.round(completed)}% completed`;
    }        
    if (!subject || !task || !time) {
        alert("Please fill out all fields.");
        return;
    }

    let dayOfWeek = new Date(time).toLocaleString('en-us', { weekday: 'long' }).toLowerCase();

    let newTask = {
        subject,
        task,
        time,
        repeat
    };

    tasks.push(newTask);
    saveTasks();
    displayTasks();
}

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function loadTasks() {
    let storedTasks = localStorage.getItem("studyTasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }
}

function displayTasks() {
    document.querySelectorAll(".day").forEach(day => day.innerHTML = day.id.charAt(0).toUpperCase() + day.id.slice(1));

    tasks.forEach(task => {
        let dayOfWeek = new Date(task.time).toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
        let taskDiv = document.createElement("div");
        taskDiv.innerHTML = `${task.subject}: ${task.task} <button onclick="removeTask('${task.time}')">❌</button>`;
        document.getElementById(dayOfWeek).appendChild(taskDiv);
    });

    updateProgress();
}

function removeTask(time) {
    tasks = tasks.filter(task => task.time !== time);
    saveTasks();
    displayTasks();
}

function updateProgress() {
    let completed = tasks.length > 0 ? (tasks.length / 7) * 100 : 0;
    document.getElementById("progressBar").value = completed;
    document.getElementById("progressText").innerText = `${Math.round(completed)}% completed`;
}

function setAlarm() {
    if (tasks.length === 0) {
        alert("No tasks scheduled for an alarm.");
        return;
    }

    let nextTask = tasks.sort((a, b) => new Date(a.time) - new Date(b.time))[0];

    let alarmTime = new Date(nextTask.time).getTime();
    let currentTime = new Date().getTime();

    let timeDiff = alarmTime - currentTime;

    if (timeDiff > 0) {
        setTimeout(() => {
            alert(`⏰ Time to study: ${nextTask.subject} - ${nextTask.task}`);
        }, timeDiff);
    } else {
        alert("The task time has already passed.");
    }
}

window.onload = () => {
    loadTasks();
};
