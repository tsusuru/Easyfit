window.addEventListener('load', init);

let speed = 0;
let incline = 0;
let isRunning = false;
let countdownTime = 0;
let workoutTotalTime = 0;
let countdownInterval = null;

function init() {
    // buttons - using querySelector for class-based selection
    const startBtns       = document.getElementById('startBtn');
    const stopBtn        = document.getElementById('stopBtn');
    const pauseBtn      = document.getElementById('pauseBtn');
    const speedUpBtn     = document.getElementById('speedUpBtn');
    const speedDownBtn   = document.getElementById('speedDownBtn');
    const inclineSlider = document.getElementById('inclineSlider');

    // Add event listeners to all start buttons
    startBtns?.addEventListener('click', startClickHandler);
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

        startBtn.classList.add("active");
        setTimeout(() => startBtn.classList.remove("active"), 200);
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
        speedEl.textContent = speed.toFixed(0);
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
            countdownTime = 600;
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
        console.log("Workout stopped");

        stopBtn.classList.add("active");
        setTimeout(() => stopBtn.classList.remove("active"), 200);
    }
}

function pauseClickHandler() {
    if (isRunning) {
        isRunning = false;
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        pauseBtn.classList.add("active");
        console.log("Workout paused");
    } else if (countdownTime > 0) {
        isRunning = true;
        startCountdown(countdownTime);
        pauseBtn.classList.remove("active");
        console.log("Workout resumed");
    }
}

function speedUpClickHandler() {
    if (speed < 20) {
        speed += 1;
        updateSpeedDisplay();
        console.log("Speed increased to:", speed);

        speedUpBtn.classList.add("active");
        setTimeout(() => speedUpBtn.classList.remove("active"), 200);
    }
}

function speedDownClickHandler() {
    if (speed > 0) {
        speed -= 1;
        updateSpeedDisplay();
        console.log("Speed decreased to:", speed);

        speedDownBtn.classList.add("active");
        setTimeout(() => speedDownBtn.classList.remove("active"), 200);
    }
}

function inclineChangeHandler(event) {
    incline = parseFloat(event.target.value);
    updateInclineDisplay();
    console.log("Incline changed to:", incline);
}

function updateInclineRotation() {
    const rotatingElement = document.getElementById('rotatingDiv');
    if (rotatingElement) {
        rotatingElement.style.transform = `rotate(${incline * -0.5}deg)`;
    }
}


function updateCurrentTime() {
    const currentTimeEl = document.querySelector('.border-x-4 h1');
    if (!currentTimeEl) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTimeEl.textContent = `${hours}:${minutes}`;
}
