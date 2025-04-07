window.addEventListener('load', init);

let speed = 0;
let incline = 0;
let isRunning = false;
let countdownTime = 0;
let workoutTotalTime = 0;
let countdownInterval = null;
let speedUpInterval = null;
let speedDownInterval = null;
let totalDistance = 0;

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
    // speedUpBtn?.addEventListener('click', speedUpClickHandler);
    speedUpBtn?.addEventListener('click', () => playSound(speedUpSound.id));
    // speedDownBtn?.addEventListener('click', speedDownClickHandler);
    speedDownBtn?.addEventListener('click', () => playSound(speedDownSound.id));
    inclineSlider?.addEventListener('input', inclineChangeHandler);
    inclineSlider?.addEventListener('input', updateInclineRotation);
    inclineUpBtn?.addEventListener('click', inclineUpClickHandler);
    inclineDownBtn?.addEventListener('click', inclineDownClickHandler);

    if (speedUpBtn) {
        speedUpBtn.addEventListener('mousedown', startIncreasingSpeed);
        speedUpBtn.addEventListener('mouseup', stopIncreasingSpeed);
        speedUpBtn.addEventListener('mouseleave', stopIncreasingSpeed);
        //voor ipad straks
        speedUpBtn.addEventListener('touchstart', startIncreasingSpeed);
        speedUpBtn.addEventListener('touchend', stopIncreasingSpeed);
    }
    if (speedDownBtn) {
        speedDownBtn.addEventListener('mousedown', startDecreasingSpeed);
        speedDownBtn.addEventListener('mouseup', stopDecreasingSpeed);
        speedDownBtn.addEventListener('mouseleave', stopDecreasingSpeed);
        // voor ipad straks
        speedDownBtn.addEventListener('touchstart', startDecreasingSpeed);
        speedDownBtn.addEventListener('touchend', stopDecreasingSpeed);
    }


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
        totalDistance = 0; // Reset distance at start
        console.log("Workout started.");

        // Default to walk mode if no time is set
        if (countdownTime === 0) {
            setWorkoutMode("walk");
        }

        // Start the countdown with distance tracking
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        countdownInterval = setInterval(() => {
            if (countdownTime > 0) {
                countdownTime--;
                updateTimerDisplay();
                updateProgressBar();
                updateDistance(); // Track distance every second
                updateRunnerPosition();
            } else {
                console.log("Countdown complete!");
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                handleStopConfirmed();
            }
        }, 1000);

        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        if (startBtn) startBtn.classList.add("active");
        if (pauseBtn) pauseBtn.classList.remove("active");
        setTimeout(() => {
            if (startBtn) startBtn.classList.remove("active");
        }, 200);

        playSound('startSound');
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
            modeLetters.textContent = "Wandelen";
            modeEL.src = "img/walking_pictogram.png";
            runnerEl.src = "img/walking.gif";
            runnerEl.style.width = "50px";
        }
        else if (speed < 14) {
            //sonic is running
            modeLetters.textContent = "Rennen";
            modeEL.src = "img/jogging_pictogram.png";
            runnerEl.src = "img/runner.gif";
            runnerEl.style.width = "50px";
        }
        else if (speed < 20) {
            //sonic is SPEEDING UP!!!
            modeLetters.textContent = "Sprinten";
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

function updateDistance() {
    // Calculate distance covered in the last second
    // speed is in km/h, so divide by 3600 to get km/s
    totalDistance += speed / 3600;
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
            handleStopConfirmed();
        }
    }, 1000);
}

function stopClickHandler() {
    if (isRunning) {
        showStopConfirmation();

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

// function speedUpClickHandler() {
//     if (speed < 20) {
//         speed += 1;
//         updateSpeedDisplay();
//         console.log("Speed increased to:", speed);
//
//         speedUpBtn.classList.add("active");
//         setTimeout(() => speedUpBtn.classList.remove("active"), 200);
//     }
// }
//
// function speedDownClickHandler() {
//     if (speed > 0) {
//         speed -= 1;
//         updateSpeedDisplay();
//         console.log("Speed decreased to:", speed);
//
//         speedDownBtn.classList.add("active");
//         setTimeout(() => speedDownBtn.classList.remove("active"), 200);
//     }
// }

function startIncreasingSpeed(){
    speedUpBtn.classList.add("active");

    if (speed < 20) {
        speed += 1;
        updateSpeedDisplay();
        console.log("Speed increased to:", speed);
    }
    speedUpDelay = setTimeout(() => {
        speedUpInterval = setInterval(() => {
            if (speed < 20) {
                speed += 1;
                updateSpeedDisplay();
                console.log("Speed increased to:", speed);
            } else {
                clearInterval(speedUpInterval);
            }
        }, 100);
    }, 500); // 1000 ms delay
}
function stopIncreasingSpeed() {
    if (speedUpInterval) {
        clearInterval(speedUpInterval);
        speedUpInterval = null;
    }
    if (speedUpDelay) {
        clearTimeout(speedUpDelay);
        speedUpDelay = null;
    }
    setTimeout(() => speedUpBtn.classList.remove("active"), 200);
}

function startDecreasingSpeed() {
    // Active animatie toevoegen
    speedDownBtn.classList.add("active");

    // Direct één keer speed verlagen
    if (speed > 0) {
        speed -= 1;
        updateSpeedDisplay();
        console.log("Speed decreased to:", speed);
    }

    // Na 500ms starten we een interval dat elke 100ms de speed verder verlaagt
    speedDownDelay = setTimeout(() => {
        speedDownInterval = setInterval(() => {
            if (speed > 0) {
                speed -= 1;
                updateSpeedDisplay();
                console.log("Speed decreased to:", speed);
            } else {
                clearInterval(speedDownInterval);
            }
        }, 100);
    }, 500);
}

function stopDecreasingSpeed() {
    if (speedDownDelay) {
        clearTimeout(speedDownDelay);
        speedDownDelay = null;
    }
    if (speedDownInterval) {
        clearInterval(speedDownInterval);
        speedDownInterval = null;
    }
    setTimeout(() => speedDownBtn.classList.remove("active"), 200);
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

function showStopConfirmation() {
    const dialog = document.getElementById('stopConfirmDialog');

    // Remove any existing event listeners
    const newDialog = dialog.cloneNode(true);
    dialog.parentNode.replaceChild(newDialog, dialog);

    // Add new event listeners
    newDialog.querySelector('#confirmStop').addEventListener('click', () => {
        newDialog.close();
        handleStopConfirmed();
    });

    newDialog.querySelector('#cancelStop').addEventListener('click', () => {
        newDialog.close();
    });

    newDialog.showModal();
}

function handleStopConfirmed() {
    const workoutDuration = workoutTotalTime - countdownTime;
    const minutes = Math.floor(workoutDuration / 60);
    const seconds = workoutDuration % 60;

    const resultDialog = document.getElementById('resultScreen');
    resultDialog.innerHTML = `
        <div class="dialog-content p-8 flex flex-col justify-center items-center min-h-screen">
             <h2 class="text-4xl mb-12 text-center">Workout Resultaten</h2>
                   <div class="flex justify-center items-center gap-8" id="results">
                         <div class="flex-1 p-6 border-4 border-[#40E0D0] rounded-xl flex flex-col items-center">
                               <h3 class="text-3xl mb-4">Mijn tijd is:</h3>
                               <p class="text-5xl">${minutes}:${seconds.toString().padStart(2, '0')}</p>
                         </div>

                         <div class="flex-1 flex justify-center">
                              <div class="w-[200px] h-[200px] flex items-center justify-center border-3 border-[#40E0D0] rounded-full">
                              <img src="img/sonic-the-hedgehog-break-dance.gif" alt="Result Icon" class="w-[150px] h-[150px]">
                         </div>    
                   </div>

                   <div class="flex-1 p-6 border-4 border-[#40E0D0] rounded-xl flex flex-col items-center">
                         <h3 class="text-3xl mb-4">Mijn afstand is:</h3>
                         <p class="text-5xl">${totalDistance.toFixed(2)} km</p>
                   </div>
         </div>

    <div class="flex justify-center mt-12">
        <button id="closeResults" class="text-white font-bold py-4 px-8 rounded-lg text-3xl border-4 border-[#40E0D0] hover:bg-[#40E0D0] hover:bg-opacity-20 transition-colors">
            Sluiten
        </button>
    </div>
</div>
    `;

    resultDialog.querySelector('#closeResults').addEventListener('click', () => {
        resultDialog.close();
    });

    playSound('stopSound');
    stopWorkout();
    resultDialog.showModal();
}

function stopWorkout() {
    isRunning = false;
    speed = 0;
    incline = 0;
    countdownTime = 0;
    workoutTotalTime = 0;

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    updateSpeedDisplay();
    updateInclineDisplay();
    updateTimerDisplay();
    updateProgressBar();
    updateRunnerPosition();

    const stopBtn = document.getElementById('stopBtn');
    if (stopBtn) {
        stopBtn.classList.add("active");
        setTimeout(() => stopBtn.classList.remove("active"), 200);
    }
}