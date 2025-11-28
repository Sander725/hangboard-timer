// -------------------------------
// Globale Variablen für den Timer
// -------------------------------

// aktueller Block (1 oder 2)
let activeBlock = null;

// Phase: "work" | "rest" | null | "finished"
let phase = null;

// Countdown Sekunden
let remaining = 0;

// Wiederholungen
let repsRemaining = 0;

// ID des setInterval
let timerId = null;

// Audio-Beep
let beepElement = null;


// Beep ein/aus
let beepEnabled = true; // Standard: Beep an



// -------------------------------
// Seite geladen
// -------------------------------
// -------------------------------
// Seite geladen
// -------------------------------
// -------------------------------
// Seite geladen
// -------------------------------
window.addEventListener("load", function() {

    beepElement = document.getElementById("beep");

    // Block 1 Buttons
    document.getElementById("start1").addEventListener("click", function() {
        startTimerFromBlock(1);
    });
    document.getElementById("stop1").addEventListener("click", stopTimer);
    document.getElementById("reset1").addEventListener("click", resetTimer);

    // Block 2 Buttons
    document.getElementById("start2").addEventListener("click", function() {
        startTimerFromBlock(2);
    });
    document.getElementById("stop2").addEventListener("click", stopTimer);
    document.getElementById("reset2").addEventListener("click", resetTimer);

    // -----------------------------------
    // BEEP-TOGGLE BUTTON
    // -----------------------------------
    const beepToggleBtn = document.getElementById("beepToggle");

    // Initialzustand
    beepEnabled = true;
    beepToggleBtn.textContent = "Beep: AN";
    beepToggleBtn.classList.add("beep-on");

    // Click-Event (Beep EIN/AUS)
    beepToggleBtn.addEventListener("click", function () {

    // Beep umschalten
    beepEnabled = !beepEnabled;

    if (beepEnabled) {
        beepToggleBtn.textContent = "Beep: AN";
        beepToggleBtn.classList.remove("beep-off");
        beepToggleBtn.classList.add("beep-on");
    } else {
        beepToggleBtn.textContent = "Beep: AUS";
        beepToggleBtn.classList.remove("beep-on");
        beepToggleBtn.classList.add("beep-off");
    }

    // iOS AUDIO UNLOCK (1x pro Session)
    if (beepElement) {
        beepElement.play().then(() => {
            beepElement.pause();
            beepElement.currentTime = 0;
        }).catch(() => {});
    }
});

});


// -------------------------------
// Timer starten, je nach Block
// -------------------------------
function startTimerFromBlock(block) {

    // merken, welcher Block aktiv ist
    activeBlock = block;

    // Falls schon ein Timer läuft: stoppen
    if (timerId !== null) {
        clearInterval(timerId);
    }

    // IDs abhängig von Block
    let onTime   = parseInt(document.getElementById(`ontime${block}`).value);
    let offTime  = parseInt(document.getElementById(`offtime${block}`).value);
    let reps     = parseInt(document.getElementById(`reps${block}`).value);

    // Initialisieren
    phase = "work";
    remaining = onTime;
    repsRemaining = reps;

    updateUI();

    // Jede Sekunde tick() aufrufen
    timerId = setInterval(function() {
        tick(onTime, offTime);
    }, 1000);
}


// -------------------------------
// Jede Sekunde
// -------------------------------
function tick(onTime, offTime) {

    remaining--;
    updateUI();

    // Beep eine Sekunde früher abfeuern
    if (remaining === 1) {
        beep();
    }

    if (remaining > 0) return;

    // Phase: WORK beendet
    if (phase === "work") {

        if (repsRemaining === 1) {
            stopTimer();
            phase = "finished";
            updateUI();
            return;
        }

        phase = "rest";
        remaining = offTime;
        updateUI();
        return;
    }

    // Phase: REST beendet
    if (phase === "rest") {

        repsRemaining--;

        phase = "work";
        remaining = onTime;
        updateUI();
        return;
    }
}



// -------------------------------
// Timer stoppen
// -------------------------------
function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}


// -------------------------------
// Reset
// -------------------------------
function resetTimer() {
    stopTimer();
    phase = null;
    remaining = 0;
    repsRemaining = 0;
    activeBlock = null;
    updateUI();
}


// -------------------------------
// UI aktualisieren
// -------------------------------
function updateUI() {
    const big = document.getElementById("countdownBig");
    const phaseText = document.getElementById("phaseBig");
    const repsText = document.getElementById("repsBig");

    if (!big || !phaseText || !repsText) return;

    // Phase & Reps aktualisieren
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




// -------------------------------
// Beep
// -------------------------------
function beep() {
    if (!beepEnabled) return; // kein Ton wenn OFF
    
    if (beepElement) {
        beepElement.currentTime = 0;
        beepElement.play();
    }
}

document.querySelectorAll(".accordion-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        const content = btn.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});



// ================================
// DARKMODE - Toggle
// ================================
window.addEventListener("load", function () {
    const btn = document.getElementById("darkmodeToggle");

    // Prüfe gespeicherte Einstellung
    if (localStorage.getItem("darkmode") === "true") {
        document.body.classList.add("darkmode");
        btn.textContent = "☀️";
    }

    btn.addEventListener("click", () => {
        document.body.classList.toggle("darkmode");

        const active = document.body.classList.contains("darkmode");
        btn.textContent = active ? "☀️" : "🌙";

        // Speichern
        localStorage.setItem("darkmode", active);
    });
});
