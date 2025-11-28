// -------------------------------------------------
// Globale Variablen
// -------------------------------------------------
let activeBlock = null;
let phase = null;          // "work", "rest", "finished", null
let remaining = 0;
let repsRemaining = 0;
let timerId = null;

let totalDuration = 0;
let elapsed = 0;

let beepEnabled = true;
let beepElement = null;


// -------------------------------------------------
// Seite geladen
// -------------------------------------------------
window.addEventListener("load", () => {

    beepElement = document.getElementById("beep");

    // Block-Buttons
    for (let b of [1, 2]) {
        document.getElementById(`start${b}`).addEventListener("click", () => startTimerFromBlock(b));
        document.getElementById(`stop${b}`).addEventListener("click", stopTimer);
        document.getElementById(`reset${b}`).addEventListener("click", resetTimer);
    }

    // Beep Toggle
    const beepBtn = document.getElementById("beepToggle");
    beepBtn.classList.add("beep-on");

    beepBtn.addEventListener("click", () => {
        beepEnabled = !beepEnabled;
        beepBtn.textContent = beepEnabled ? "Beep: AN" : "Beep: AUS";
        beepBtn.classList.toggle("beep-on", beepEnabled);
        beepBtn.classList.toggle("beep-off", !beepEnabled);

        // iOS unlock
        beepElement.play().then(() => {
            beepElement.pause();
            beepElement.currentTime = 0;
        }).catch(() => {});
    });

    // Darkmode Toggle
    const darkBtn = document.getElementById("darkmodeToggle");

    if (localStorage.getItem("darkmode") === "true") {
        document.body.classList.add("darkmode");
        darkBtn.textContent = "☀️";
    }

    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("darkmode");
        const active = document.body.classList.contains("darkmode");
        darkBtn.textContent = active ? "☀️" : "🌙";
        localStorage.setItem("darkmode", active);
    });

    // Accordion
    document.querySelectorAll(".accordion-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            const content = btn.nextElementSibling;
            content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
        });
    });
});


// -------------------------------------------------
// Timer starten
// -------------------------------------------------
function startTimerFromBlock(block) {

    activeBlock = block;

    let on = parseInt(document.getElementById(`ontime${block}`).value);
    let off = parseInt(document.getElementById(`offtime${block}`).value);
    let reps = parseInt(document.getElementById(`reps${block}`).value);

    stopTimer();

    phase = "work";
    remaining = on;
    repsRemaining = reps;

    calculateTotalDuration(on, off, reps);
    updateProgressBar();
    updateUI();

    timerId = setInterval(() => tick(on, off), 1000);
}


// -------------------------------------------------
// Tick
// -------------------------------------------------
function tick(on, off) {

    remaining--;
    elapsed++;
    updateProgressBar();
    updateUI();

    if (remaining === 1) beep();

    if (remaining > 0) return;

    if (phase === "work") {

        if (repsRemaining === 1) {
            stopTimer();
            phase = "finished";
            elapsed = totalDuration;
            updateProgressBar();
            updateUI();
            return;
        }

        phase = "rest";
        remaining = off;
        updateUI();
        return;
    }

    if (phase === "rest") {
        repsRemaining--;
        phase = "work";
        remaining = on;
        updateUI();
    }
}


// -------------------------------------------------
// Timer stoppen + Reset
// -------------------------------------------------
function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function resetTimer() {
    stopTimer();
    phase = null;
    remaining = 0;
    repsRemaining = 0;
    activeBlock = null;
    updateUI();
}


// -------------------------------------------------
// Fortschrittsbalken
// -------------------------------------------------
function calculateTotalDuration(on, off, reps) {
    totalDuration = on * reps + off * (reps - 1);
    elapsed = 0;
}

function updateProgressBar() {
    const bar = document.getElementById("progressBar");
    if (totalDuration === 0) return;

    const percent = (elapsed / totalDuration) * 100;
    bar.style.width = Math.min(100, percent) + "%";

    // dynamische Farbe rot → grün
    const p = elapsed / totalDuration;
    const r = Math.round(255 * (1 - p));
    const g = Math.round(255 * p);
    bar.style.backgroundColor = `rgb(${r}, ${g}, 0)`;
}


// -------------------------------------------------
// UI
// -------------------------------------------------
function updateUI() {
    const big = document.getElementById("countdownBig");
    const phaseText = document.getElementById("phaseBig");
    const repsText = document.getElementById("repsBig");

    if (phase === "work") {
        phaseText.textContent = "HANG";
        repsText.textContent = "Reps übrig: " + repsRemaining;
        big.textContent = remaining + " s";
        big.style.color = "red";
        phaseText.style.color = "red";

    } else if (phase === "rest") {
        phaseText.textContent = "PAUSE";
        repsText.textContent = "Reps übrig: " + repsRemaining;
        big.textContent = remaining + " s";
        big.style.color = "green";
        phaseText.style.color = "green";

    } else if (phase === "finished") {
        phaseText.textContent = "FERTIG!";
        repsText.textContent = "";
        big.textContent = "Done!";
        phaseText.style.color = "green";

    } else {
        phaseText.textContent = "Ready";
        repsText.textContent = "";
        big.textContent = "";
        phaseText.style.color = "black";
    }
}


// -------------------------------------------------
// Beep
// -------------------------------------------------
function beep() {
    if (beepEnabled && beepElement) {
        beepElement.currentTime = 0;
        beepElement.play();
    }
}
