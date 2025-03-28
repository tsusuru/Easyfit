window.addEventListener('load', init);


let speed = 0;
let incline = 0;
let isRunning = false;
let countdownTime = 0;
let workoutTotalTime = 0;
let countdownInterval = null;
function init() {

    // buttons
    const startBtn       = document.getElementById('startBtn');
    const stopBtn        = document.getElementById('stopBtn');
    const speedUpBtn     = document.getElementById('speedUpBtn');
    const speedDownBtn   = document.getElementById('speedDownBtn');
    const inclineSlider  = document.getElementById('inclineSlider');
    const arrowBack      = document.getElementById('arrowBack');

    //modes
    const walkBtn   = document.getElementById('walkModeBtn');
    const sprintBtn = document.getElementById('sprintModeBtn');
    const hillBtn   = document.getElementById('hillModeBtn');

    //eventlisteners buttons
    startBtn.addEventListener('click', startClickHandler);
    stopBtn.addEventListener('click', stopClickHandler);
    speedUpBtn.addEventListener('click', speedUpClickHandler);
    speedDownBtn.addEventListener('click', speedDownClickHandler);
    inclineSlider.addEventListener('input', inclineChangeHandler);
    arrowBack.addEventListener('click', arrowBackHandler);

    //eventlisteners modes
    walkBtn?.addEventListener('click', () => setWorkoutMode("walk"));
    sprintBtn?.addEventListener('click', () => setWorkoutMode("sprint"));
    hillBtn?.addEventListener('click', () => setWorkoutMode("hill"));

    updateSpeedDisplay();
    updateInclineDisplay();
    updateTimerDisplay();
    updateProgressBar(0);
    console.log("init() -> Event listeners ingesteld.");
}

function startClickHandler() {
    if (!isRunning) {
        isRunning = true;
        console.log("Workout gestart.");

        // Start de countdown, maar alleen als countdownTime > 0
        if (countdownTime > 0) {
            startCountdown(countdownTime);
        } else {
            console.log("Geen tijd ingesteld. Kies eerst een workout-mode of stel tijd in.");
        }
    }
}

function stopClickHandler() {
    if (isRunning) {
        isRunning = false;
        console.log("Workout gestopt.");


        stopCountdown();
    }
}

function speedUpClickHandler(e) {
    speed++;
    updateSpeedDisplay();
    console.log("Speed verhoogd ->", speed);
}

function speedDownClickHandler(e) {
    if (speed > 0) {
        speed--;
        updateSpeedDisplay();
        console.log("Speed verlaagd ->", speed);
    }
}

function inclineChangeHandler(e) {
    incline = parseFloat(e.target.value);
    updateInclineDisplay();
    console.log("Incline veranderd ->", incline);
}

function arrowBackHandler(e) {
    console.log("Ga terug naar voorgaand scherm.");
}
function setWorkoutMode(mode) {
    switch (mode) {
        case "walk":
            speed = 3;
            incline = 0;
            countdownTime = 600;
            console.log("Mode: Wandelen");
            break;

        case "sprint":
            speed = 10;
            incline = 2;
            countdownTime = 120;
            console.log("Mode: Sprint");
            break;

        case "hill":
            speed = 5;
            incline = 5;
            countdownTime = 300;
            console.log("Mode: Heuvel");
            break;

        default:
            console.log("Onbekende mode.");
            break;
    }
    workoutTotalTime = countdownTime;
    const inclineSlider = document.getElementById('inclineSlider');
    if (inclineSlider) {
        inclineSlider.value = incline;
    }

    // Update meteen de interface
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
            console.log("Countdown klaar!");
            stopCountdown();
        }
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
}

function updateTimerDisplay() {
    const timeEl = document.getElementById('timeDisplay');
    if (!timeEl) return;

    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;

    timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateSpeedDisplay() {
    const speedEl = document.getElementById('speedValue');
    if (speedEl) {
        speedEl.textContent = speed.toFixed(1);
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

    progressEl.style.width = percentage + "%";
}
