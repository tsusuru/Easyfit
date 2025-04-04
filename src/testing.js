window.addEventListener('load', init);

let speed = 0;
let incline = 0;
let isRunning = false;
let countdownTime = 0;
let workoutTotalTime = 0;
let countdownInterval = null;

function init() {

    showWorkoutDialog(); // Show the workout dialog on page load (KEEP AT THE BEGINNING OF THE FUNCTION)

    // buttons - using querySelector for class-based selection
    const startBtns       = document.getElementById('startBtn');
    const stopBtn        = document.getElementById('stopBtn');
    const pauseBtn      = document.getElementById('pauseBtn');
    const speedUpBtn     = document.getElementById('speedUpBtn');
    const speedDownBtn   = document.getElementById('speedDownBtn');
    const inclineSlider = document.getElementById('inclineSlider');
    const inclineUpBtn = document.getElementById('incline-up');
    const inclineDownBtn = document.getElementById('incline-down');

    const startSound = document.getElementById('startSound');
    const stopSound = document.getElementById('stopSound');
    const speedUpSound = document.getElementById('speedUpSound');
    const speedDownSound = document.getElementById('speedDownSound');

    // Add event listeners to all start buttons
    startBtns?.addEventListener('click', startClickHandler);
    stopBtn?.addEventListener('click', stopClickHandler);
    pauseBtn?.addEventListener('click', pauseClickHandler);
    speedUpBtn?.addEventListener('click', speedUpClickHandler);
    speedUpBtn?.addEventListener('click', () => playSound(speedUpSound.id));
    speedDownBtn?.addEventListener('click', speedDownClickHandler);
    speedDownBtn?.addEventListener('click', () => playSound(speedDownSound.id));
    inclineSlider?.addEventListener('input', inclineChangeHandler);
    inclineSlider?.addEventListener('input', updateInclineRotation);
    inclineUpBtn?.addEventListener('click', inclineUpClickHandler);
    inclineDownBtn?.addEventListener('click', inclineDownClickHandler);

    // Initial UI updates
    updateSpeedDisplay();
    updateInclineDisplay();
    updateTimerDisplay();
    updateProgressBar(0);
    console.log("init() -> Event listeners set.");

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
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

    // Reset angle of incline graphic
    const rotatingElement = document.getElementById('rotatingDiv');
    if (rotatingElement) {
        rotatingElement.style.transform = `rotate(0deg)`;
    }
}

function updateTimerDisplay() {
    const timeDisplayEl = document.querySelector('#timeDisplay h2');
    if (!timeDisplayEl) return;

    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    timeDisplayEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateSpeedDisplay() {
    const speedEl = document.getElementById('speed-counter');
    if (speedEl) {
        speedEl.textContent = speed.toFixed(0);
    }
    const runnerEl = document.getElementById('runner');
    const modeEL = document.getElementById('treadmillMode');
    const modeLetters = document.getElementById('treadMillModeLetters')
    if (runnerEl) {
        if (speed === 0) {
            //sonic is idle
            modeLetters.textContent = "Rusten";
            modeEL.src = "img/walking_pictogram.png";
            runnerEl.src = "img/idle.gif";
            runnerEl.style.width = "70px";
        }
        else if (speed < 5) {
            //sonic is walking
            modeLetters.textContent = "Lopen";
            modeEL.src = "img/walking_pictogram.png";
            runnerEl.src = "img/walking.gif";
            runnerEl.style.width = "50px";
        }
        else if (speed < 14) {
            //sonic is running
            modeLetters.textContent = "Joggen";
            modeEL.src = "img/jogging_pictogram.png";
            runnerEl.src = "img/runner.gif";
            runnerEl.style.width = "50px";
        }
        else if (speed < 20) {
            //sonic is SPEEDING UP!!!
            modeLetters.textContent = "Rennen";
            modeEL.src = "img/running_pictogram.png";
            runnerEl.src = "img/betterboosting.gif";
            runnerEl.style.width = "100px";
        }
        else {
            //supersonic
            modeLetters.textContent = "Limit breaken";
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


function setWorkoutMode(mode) {
    switch (mode) {
        case "walk":
            speed = 3;
            incline = 0;
            countdownTime = 60;
            break;
        case "jog":
            speed = 10;
            incline = 0;
            countdownTime = 120;
            break;
        case "sprint":
            speed = 15;
            incline = 0;
            countdownTime = 60;
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

        const inclineSlider = document.getElementById('inclineSlider');
        if (inclineSlider) {
            inclineSlider.value = 0;
        }

        const rotatingElement = document.getElementById('rotatingDiv');
        if (rotatingElement) {
            rotatingElement.style.transform = `rotate(0deg)`;
        }

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

function inclineUpClickHandler() {
    const inclineSlider = document.getElementById('inclineSlider');
    if (inclineSlider && incline < 10) {
        incline = Math.min(10, incline + 1.0);
        inclineSlider.value = incline;
        updateInclineDisplay();
        updateInclineRotation();
        console.log("Incline increased to:", incline);
    }
}

function inclineDownClickHandler() {
    const inclineSlider = document.getElementById('inclineSlider');
    if (inclineSlider && incline > 0) {
        incline = Math.max(0, incline - 1.0);
        inclineSlider.value = incline;
        updateInclineDisplay();
        updateInclineRotation();
        console.log("Incline decreased to:", incline);
    }
}

// Function to display the workout options dialog
function showWorkoutDialog() {
    const dialog = document.querySelector('dialog');
    const dialogContent = dialog.querySelector('.dialog-content');

    dialogContent.innerHTML = `
        <h2 class="text-6xl mb-12 text-center">Wat wil je doen?</h2>
        <div class="flex justify-center items-center gap-16">
            <div class="workout-option cursor-pointer" data-mode="walk">
                <img src="img/walking_pictogram.png" alt="Walk Workout" 
                    class="w-[30rem] transition-transform duration-200 hover:scale-105">
                <p class="text-center mt-4 text-3xl">Ik wil wandelen!</p>
            </div>
            <div class="workout-option cursor-pointer" data-mode="jog">
                <img src="img/jogging_pictogram.png" alt="Jog Workout" 
                    class="w-[30rem] transition-transform duration-200 hover:scale-105">
                <p class="text-center mt-4 text-3xl">Ik wil rennen!</p>
            </div>
            <div class="workout-option cursor-pointer" data-mode="sprint">
                <img src="img/running_pictogram.png" alt="Sprint Workout" 
                    class="w-[30rem] transition-transform duration-200 hover:scale-105">
                <p class="text-center mt-4 text-3xl">Ik wil sprinten!</p>
            </div>
        </div>
    `;

    dialogContent.querySelectorAll('.workout-option').forEach(button => {
        button.addEventListener('click', () => {
            setWorkoutMode(button.dataset.mode);
            dialog.close();
        });
    });

    dialog.showModal();
}