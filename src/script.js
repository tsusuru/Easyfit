window.addEventListener('load', init);


let speed = 0;
let incline = 0;
let isRunning = false;
let countdownTime = 0;
let countdownInterval = null;
function init() {
    const startBtn       = document.getElementById('startBtn');
    const stopBtn        = document.getElementById('stopBtn');
    const speedUpBtn     = document.getElementById('speedUpBtn');
    const speedDownBtn   = document.getElementById('speedDownBtn');
    const inclineSlider  = document.getElementById('inclineSlider');
    const arrowBack      = document.getElementById('arrowBack');

    const walkBtn   = document.getElementById('walkModeBtn');
    const sprintBtn = document.getElementById('sprintModeBtn');
    const hillBtn   = document.getElementById('hillModeBtn');

    startBtn.addEventListener('click', startClickHandler);
    stopBtn.addEventListener('click', stopClickHandler);
    speedUpBtn.addEventListener('click', speedUpClickHandler);
    speedDownBtn.addEventListener('click', speedDownClickHandler);
    inclineSlider.addEventListener('input', inclineChangeHandler);
    arrowBack.addEventListener('click', arrowBackHandler);

    walkBtn?.addEventListener('click', () => setWorkoutMode("walk"));
    sprintBtn?.addEventListener('click', () => setWorkoutMode("sprint"));
    hillBtn?.addEventListener('click', () => setWorkoutMode("hill"));

    updateSpeedDisplay();
    updateInclineDisplay();
    updateTimerDisplay();
    console.log("init() -> Event listeners ingesteld.");
}

function startClickHandler(e) {
    if (!isRunning) {
        isRunning = true;
        console.log("Workout gestart.");
    }
}

function stopClickHandler(e) {
    if (isRunning) {
        isRunning = false;
        console.log("Workout gestopt.");
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
    // Stel speed, incline, countdownTime etc.
    switch (mode) {
        case "walk":
            speed = 3;        // voorbeeld
            incline = 0;      // voorbeeld
            countdownTime = 600; // 10 minuten in seconden
            console.log("Mode: Wandelen");
            break;

        case "sprint":
            speed = 10;
            incline = 2;
            countdownTime = 120; // 2 minuten sprint
            console.log("Mode: Sprint");
            break;

        case "hill":
            speed = 5;
            incline = 5;
            countdownTime = 300; // 5 minuten
            console.log("Mode: Heuvel");
            break;

        default:
            console.log("Onbekende mode.");
            break;
    }

    // Update meteen de interface
    updateSpeedDisplay();
    updateInclineDisplay();
    updateTimerDisplay();
}

function startCountdown(timeInSeconds) {
    // Zorg dat we niet twee timers tegelijk starten
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // countdownTime is al ingesteld via setWorkoutMode
    countdownInterval = setInterval(() => {
        if (countdownTime > 0) {
            countdownTime--;
            updateTimerDisplay();
        } else {
            // Tijd is op
            console.log("Countdown klaar! Workout afgelopen.");
            stopCountdown(); // timer stoppen
            // Je zou hier ook `stopClickHandler()` kunnen aanroepen
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
