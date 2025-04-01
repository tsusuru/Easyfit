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
    const pauseBtn      = document.getElementById('pauseBtn');
    const speedUpBtn     = document.getElementById('speedUpBtn');
    const speedDownBtn   = document.getElementById('speedDownBtn');
    const inclineSlider  = document.getElementById('inclineSlider');
    const arrowBack      = document.getElementById('arrowBack');
   // const customBtn = document.getElementById('customBtn');

    //modes
    const walkBtn   = document.getElementById('walkModeBtn');
    const sprintBtn = document.getElementById('sprintModeBtn');
    const hillBtn   = document.getElementById('hillModeBtn');

    //eventlisteners buttons
    startBtn.addEventListener('click', startClickHandler);
    stopBtn.addEventListener('click', stopClickHandler);
    pauseBtn.addEventListener('click', pauseClickHandler);
    speedUpBtn.addEventListener('click', speedUpClickHandler);
    speedDownBtn.addEventListener('click', speedDownClickHandler);
    inclineSlider.addEventListener('input', inclineChangeHandler);
    arrowBack.addEventListener('click', arrowBackHandler);
   // customBtn.addEventListener('click', customClickHandler);

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

function pauseClickHandler() {
    if (isRunning) {
        isRunning = false;
        console.log("Workout gepauzeerd.");
        stopCountdown(); // timer stoppen

        // Zet de speed op 0 tijdens de pauze
        speed = 0;
        updateSpeedDisplay();
    }
}


function customClickHandler(){
    console.log("U heeft de custom optie gekozen")
    //Zet hierin de code voor wanneer je op de button "Custom klikt"
    //Je moet tijd, incline en speed zelf kunnen instellen met deze button
}

function stopClickHandler() {
    // Reset alles
    console.log("Workout volledig gestopt en gereset.");
    isRunning = false;

    // Reset waardes
    speed = 0;
    incline = 0;
    countdownTime = 0;
    workoutTotalTime = 0;

    // Timer uit
    stopCountdown();

    // UI updaten
    updateSpeedDisplay();
    updateInclineDisplay();
    updateTimerDisplay();
    updateProgressBar(0)
    updateRunnerPosition();
    displayResults()
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
    console.log("Slider changed:", e.target.value);
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
            updateRunnerPosition();

        } else {
            console.log("Countdown klaar!");
            stopCountdown();
            displayResults();
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

    // Runner-animatie veranderen op basis van de speed
    const runnerEl = document.getElementById('runner');
    if (runnerEl) {
        if (speed === 0) {
            // Bij speed=0 => idle-animatie
            runnerEl.src = "img/idle.gif";
        } else if (speed < 5) {
            // Bij speed tussen 1 en 4 => walking
            runnerEl.src = "img/walking.gif";
        } else {
            // Bij speed >=5 => running
            runnerEl.src = "img/runner.gif";
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

    progressEl.style.width = percentage + "%";
}

function displayResults(){
    console.log("display the results, not coded yet")
    //Zet hierin de resultaten nadat je je workout heb gedaan
    //Tijd verstreken, welke workout je deed met welke standen etc etc
}

function updateRunnerPosition() {
    const runner = document.getElementById('runner');
    if (!runner) return;
    if (workoutTotalTime === 0) {
        runner.style.left = "0px";
        return;
    }


    const fraction = (workoutTotalTime - countdownTime) / workoutTotalTime;

    // We bewegen de renner in % van de containerbreedte.
    const percentMovement = fraction * 90;

    // Runner links in percentages
    runner.style.left = percentMovement + "%";
}

