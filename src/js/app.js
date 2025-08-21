let timeLimitCentiseconds = 0;

function calculateTimeLimit() {
    const timeLimitMinInput = document.getElementById('time-limit-min').value;
    const timeLimitSecInput = document.getElementById('time-limit-sec').value;
    const timeLimitMin = parseTimeValue(timeLimitMinInput);
    const timeLimitSec = parseTimeValue(timeLimitSecInput);
    return timeToCentiseconds(timeLimitMin, timeLimitSec, 0);
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
    const centisecondsInput = div.querySelector('.centiseconds');
    const centiseconds = centisecondsInput.disabled && div.dataset.storedCentiseconds 
        ? parseTimeValue(div.dataset.storedCentiseconds)
        : parseTimeValue(centisecondsInput.value);
    const solveTime = timeToCentiseconds(minutes, seconds, centiseconds);
    
    const wouldExceed = solveTime > 0 && (totalCentiseconds + solveTime) > timeLimitCentiseconds;
    
    return { minutes, seconds, centiseconds, solveTime, wouldExceed };
}

function updateResults(skipSave = false) {
    timeLimitCentiseconds = calculateTimeLimit();

    if (!skipSave) {
        const { minutes: timeLimitMin, seconds: timeLimitSec } = centisecondsToTime(timeLimitCentiseconds);
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
        
        updateSolveState(div, { timeLimitCentiseconds, remainingTime, solveTime: solveData.solveTime, wouldExceed: solveData.wouldExceed, firstDNFIndex, currentIndex: index });
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
