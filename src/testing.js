window.addEventListener('load', init);

let speed = 0;
let incline = 0;
let isRunning = false;
let countdownTime = 0;
let workoutTotalTime = 0;
let countdownInterval = null;

function init() {
    // buttons - using querySelector for class-based selection
    const startBtns = document.querySelectorAll('.startBtn');
    const stopBtn = document.querySelector('.stopBtn');
    const pauseBtn = document.querySelector('.pauseBtn');
    const speedUpBtn = document.querySelector('.speedUpBtn');
    const speedDownBtn = document.querySelector('.speedDownBtn');
    const inclineSlider = document.getElementById('inclineSlider');

    // Add event listeners to all start buttons
    startBtns.forEach(btn => btn.addEventListener('click', startClickHandler));
    stopBtn?.addEventListener('click', stopClickHandler);
    pauseBtn?.addEventListener('click', pauseClickHandler);
    speedUpBtn?.addEventListener('click', speedUpClickHandler);
    speedDownBtn?.addEventListener('click', speedDownClickHandler);
    inclineSlider?.addEventListener('input', inclineChangeHandler);
    inclineSlider?.addEventListener('input', updateInclineRotation);

    // Initial UI updates
    updateSpeedDisplay();
    updateInclineDisplay();
    updateTimerDisplay();
    updateProgressBar(0);
    console.log("init() -> Event listeners set.");

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

function startClickHandler() {
    if (!isRunning) {
        isRunning = true;
        console.log("Workout started.");

        // Default to walk mode if no time is set
        if (countdownTime === 0) {
            setWorkoutMode("walk");
        }

        startCountdown(countdownTime);
    }
}

function updateTimerDisplay() {
    const timeDisplayEl = document.querySelector('#timeDisplay h2');
    if (!timeDisplayEl) return;

    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    timeDisplayEl.textContent = timeString;
}

function updateSpeedDisplay() {
    const speedEl = document.getElementById('speed-counter');
    if (speedEl) {
        speedEl.textContent = speed.toFixed(1);
    }
    const runnerEl = document.getElementById('runner');
    if (runnerEl) {
        if (speed === 0) {
            //sonic is idle
            runnerEl.src = "img/idle.gif";
            runnerEl.style.width = "70px";
        }
        else if (speed < 5) {
            //sonic is walking
            runnerEl.src = "img/walking.gif";
            runnerEl.style.width = "50px";
        }
        else if (speed < 14) {
            //sonic is running
            runnerEl.src = "img/runner.gif";
            runnerEl.style.width = "50px";
        }
        else if (speed < 20) {
            //sonic is SPEEDING UP!!!
            runnerEl.src = "img/betterboosting.gif";
            runnerEl.style.width = "100px";
        }
        else {
            //supersonic
            runnerEl.src = "img/supersonic.gif";
            runnerEl.style.width = "150px";
        }
    }
}

function updateInclineDisplay() {
    const inclineCounterEl = document.getElementById('inclineCounter');
    if (inclineCounterEl) {
        inclineCounterEl.textContent = incline.toFixed(1);
    }
}

function updateProgressBar() {
    const progressEl = document.getElementById('progressFill');
    if (!progressEl) return;

    if (workoutTotalTime === 0) {
        progressEl.style.width = "0%";
        return;
    }

    const fraction = (workoutTotalTime - countdownTime) / workoutTotalTime;
    const percentage = fraction * 100;
    progressEl.style.width = `${percentage}%`;
}

// Keep the remaining functions (stopClickHandler, pauseClickHandler, etc.) as they are,
// just remove references to elements that don't exist in the HTML

function setWorkoutMode(mode) {
    switch (mode) {
        case "walk":
            speed = 3;
            incline = 0;
            countdownTime = 60;
            break;
        case "sprint":
            speed = 10;
            incline = 2;
            countdownTime = 120;
            break;
        case "hill":
            speed = 5;
            incline = 5;
            countdownTime = 300;
            break;
    }
    workoutTotalTime = countdownTime;

    const inclineSlider = document.getElementById('inclineSlider');
    if (inclineSlider) {
        inclineSlider.value = incline;
    }

    updateSpeedDisplay();
    updateInclineDisplay();
    updateTimerDisplay();
    updateProgressBar(0);
    updateRunnerPosition();
}

function startCountdown(timeInSeconds) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        if (countdownTime > 0) {
            countdownTime--;
            updateTimerDisplay();
            updateProgressBar();
            updateRunnerPosition();
        } else {
            console.log("Countdown complete!");
            stopCountdown();
            displayResults();
        }
    }, 1000);
}

function stopClickHandler() {
    if (isRunning) {
        isRunning = false;
        speed = 0;
        incline = 0;
        countdownTime = 0;
        workoutTotalTime = 0;

        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        // Reset displays
        updateSpeedDisplay();
        updateInclineDisplay();
        updateTimerDisplay();
        updateProgressBar();
        updateRunnerPosition();
        console.log("Workout stopped");
    }
}

function pauseClickHandler() {
    if (isRunning) {
        isRunning = false;
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        console.log("Workout paused");
    } else if (countdownTime > 0) {
        isRunning = true;
        startCountdown(countdownTime);
        console.log("Workout resumed");
    }
}

function speedUpClickHandler() {
    if (speed < 20) {
        speed += 0.5;
        updateSpeedDisplay();
        console.log("Speed increased to:", speed);
    }
}

function speedDownClickHandler() {
    if (speed > 0) {
        speed -= 0.5;
        updateSpeedDisplay();
        console.log("Speed decreased to:", speed);
    }
}

function inclineChangeHandler(event) {
    incline = parseFloat(event.target.value);
    updateInclineDisplay();
    console.log("Incline changed to:", incline);
}

function updateInclineRotation() {
    const rotatingElement = document.getElementById('rotatingDiv');
    if (!rotatingElement) return;

    rotatingElement.style.transformOrigin = "bottom left";
    rotatingElement.style.transform = `rotate(${incline * -0.5}deg)`;
}


function updateRunnerPosition() {
    const runner = document.getElementById('runner');
    const rotatingDiv = document.getElementById('rotatingDiv');
    if (!runner || !rotatingDiv ) return;

    const verticalOffsetForPadding = 56; // ~3.5rem

    if (workoutTotalTime === 0){
        runner.style.left = "0px"
        runner.style.bottom = `${verticalOffsetForPadding}px`;
        return;

    }

    // fraction: how far are we in the workout?
    const fraction = (workoutTotalTime - countdownTime) / workoutTotalTime;

    // underscore width calculations
    const lineLength = rotatingDiv.offsetWidth - runner.offsetWidth;
    const travelDist = fraction * lineLength;

    // some math thing with pi (pythagoras stuff)
    const angleDeg = incline * 0.5;
    const angleRad = angleDeg * (Math.PI / 180);

    //transform-origin: bottom left x and y calc
    const x = travelDist * Math.cos(angleRad);
    const y = travelDist * Math.sin(angleRad);


    // positioning sonic on x axis
    runner.style.left = `${x}px`;
    // positioning sonic on y axis
    runner.style.bottom = `${y + verticalOffsetForPadding}px`;
}







function updateCurrentTime() {
    const currentTimeEl = document.querySelector('.border-x-4 h1');
    if (!currentTimeEl) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTimeEl.textContent = `${hours}:${minutes}`;
}




