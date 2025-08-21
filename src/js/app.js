let timeLimitCentiseconds = 0;

function calculateTimeLimit() {
    const timeLimitMinInput = document.getElementById('time-limit-min').value;
    const timeLimitSecInput = document.getElementById('time-limit-sec').value;
    const timeLimitMin = parseTimeValue(timeLimitMinInput);
    const timeLimitSec = parseTimeValue(timeLimitSecInput);
    return timeLimitMin * 6000 + timeLimitSec * 100;
}

function saveTimeLimit(timeLimitMin, timeLimitSec) {
    if (timeLimitMin !== 0 || timeLimitSec !== 0) {
        localStorage.setItem('timeLimit', JSON.stringify({ minutes: timeLimitMin, seconds: timeLimitSec }));
    } else {
        localStorage.removeItem('timeLimit');
    }
}

function processSolveInput(div, index, totalCentiseconds, timeLimitCentiseconds) {
    const minutes = parseTimeValue(div.querySelector('.minutes').value);
    const seconds = parseTimeValue(div.querySelector('.seconds').value);
    const centiseconds = parseTimeValue(div.querySelector('.centiseconds').value);
    const solveTime = minutes * 6000 + seconds * 100 + centiseconds;
    
    const wouldExceed = solveTime > 0 && (totalCentiseconds + solveTime) > timeLimitCentiseconds;
    
    return { minutes, seconds, centiseconds, solveTime, wouldExceed };
}

function updateResults(skipSave = false) {
    timeLimitCentiseconds = calculateTimeLimit();

    if (!skipSave) {
        const timeLimitMin = Math.floor(timeLimitCentiseconds / 6000);
        const timeLimitSec = Math.floor((timeLimitCentiseconds % 6000) / 100);
        saveTimeLimit(timeLimitMin, timeLimitSec);
    }

    let totalCentiseconds = 0;
    const solves = [];
    let remainingTime = timeLimitCentiseconds;
    let firstDNFIndex = -1;
    
    document.querySelectorAll('.solve-input').forEach((div, index) => {
        const solveData = processSolveInput(div, index, totalCentiseconds, timeLimitCentiseconds);
        
        if (solveData.wouldExceed && firstDNFIndex === -1) {
            firstDNFIndex = index;
        }
        
        if (solveData.solveTime > 0) {
            totalCentiseconds += solveData.solveTime;
            remainingTime -= solveData.solveTime;
        }
        
        solves.push({ minutes: solveData.minutes, seconds: solveData.seconds, centiseconds: solveData.centiseconds });
        
        updateSolveState(div, timeLimitCentiseconds, remainingTime, solveData.solveTime, solveData.wouldExceed, firstDNFIndex, index);
    });

    localStorage.setItem('solveTimes', JSON.stringify(solves));
    updateDisplayedTimes(totalCentiseconds);
}

function updateDisplayedTimes(totalCentiseconds) {
    document.getElementById('total-time').textContent = formatTime(totalCentiseconds);
    const remainingTimeElement = document.getElementById('remaining-time');
    const remainingTime = timeLimitCentiseconds - totalCentiseconds;
    remainingTimeElement.textContent = formatTime(remainingTime);
    remainingTimeElement.classList.toggle('negative', remainingTime < 0);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    loadSavedTimeLimit();
    loadSavedEventConfig();
    setupEventListeners();
    updateSolveFields();
    
    if (localStorage.getItem('timeLimit')) {
        timeLimitCentiseconds = calculateTimeLimit();
        updateResults(false);
    }
});

window.updateSolveFields = updateSolveFields;
