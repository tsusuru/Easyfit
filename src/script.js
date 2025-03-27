window.addEventListener('load', init);


let speed = 0;
let incline = 0;
let isRunning = false;

function init() {
    // Haal DOM-elementen op
    const startBtn       = document.getElementById('startBtn');
    const stopBtn        = document.getElementById('stopBtn');
    const speedUpBtn     = document.getElementById('speedUpBtn');
    const speedDownBtn   = document.getElementById('speedDownBtn');
    const inclineSlider  = document.getElementById('inclineSlider');
    const arrowBack      = document.getElementById('arrowBack');

    startBtn.addEventListener('click', startClickHandler);
    stopBtn.addEventListener('click', stopClickHandler);
    speedUpBtn.addEventListener('click', speedUpClickHandler);
    speedDownBtn.addEventListener('click', speedDownClickHandler);
    inclineSlider.addEventListener('input', inclineChangeHandler);
    arrowBack.addEventListener('click', arrowBackHandler);

    updateSpeedDisplay();
    updateInclineDisplay();
    console.log("init() -> Event listeners ingesteld.");
}

function startClickHandler(e) {
    if (!isRunning) {
        isRunning = true;
        console.log("Workout gestart.");
        // Start bijvoorbeeld een timer, progress bar, etc.
    }
}

function stopClickHandler(e) {
    if (isRunning) {
        isRunning = false;
        console.log("Workout gestopt.");
        // Stop timers, toon “stop” overlay, etc.
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
    // Hier je navigatielogica
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
