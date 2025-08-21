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
    const minutesInput = div.querySelector('.minutes');
    const secondsInput = div.querySelector('.seconds');
    const centisecondsInput = div.querySelector('.centiseconds');
    
    const minutes = parseTimeValue(minutesInput.value);
    const seconds = parseTimeValue(secondsInput.value);
    const centiseconds = centisecondsInput.disabled ? 0 : parseTimeValue(centisecondsInput.value);
    
    const solveTime = timeToCentiseconds(minutes, seconds, centiseconds);
    const wouldExceed = solveTime > 0 && (totalCentiseconds + solveTime) > timeLimitCentiseconds;
    
    let finalCentiseconds;
    if (centisecondsInput.disabled && div.dataset.storedCentiseconds) {
        finalCentiseconds = div.dataset.storedCentiseconds === '' ? undefined : parseTimeValue(div.dataset.storedCentiseconds);
    } else {
        finalCentiseconds = centisecondsInput.value === '' ? undefined : centiseconds;
    }
    
    return { 
        minutes: minutesInput.value === '' ? undefined : minutes,
        seconds: secondsInput.value === '' ? undefined : seconds,
        centiseconds: finalCentiseconds,
        solveTime, 
        wouldExceed 
    };
}

function updateResults(skipSave = false) {
    timeLimitCentiseconds = calculateTimeLimit();

    if (!skipSave) {
        const { minutes: timeLimitMin, seconds: timeLimitSec } = centisecondsToTime(timeLimitCentiseconds);
        saveTimeLimit(timeLimitMin, timeLimitSec);
    }

    const solves = [];
    let cumulativeTime = 0;
    let firstDNFIndex = -1;
    
    document.querySelectorAll('.solve-input').forEach((div, index) => {
        const solveData = processSolveInput(div, index, cumulativeTime, timeLimitCentiseconds);
        
        if (solveData.wouldExceed && firstDNFIndex === -1) {
            firstDNFIndex = index;
        }
        
        if (solveData.solveTime > 0) {
            cumulativeTime += solveData.solveTime;
        }
        
        const centisecondsInput = div.querySelector('.centiseconds');
        const storedCentiseconds = centisecondsInput.disabled && div.dataset.storedCentiseconds ? div.dataset.storedCentiseconds : undefined;
        solves.push({ minutes: solveData.minutes, seconds: solveData.seconds, centiseconds: solveData.centiseconds, storedCentiseconds });
        
        const isDNF = firstDNFIndex === index;
        const isDNS = firstDNFIndex !== -1 && index > firstDNFIndex;
        
        updateSolveState(div, { isDNF, isDNS, solveTime: solveData.solveTime });
    });

    localStorage.setItem('solveTimes', JSON.stringify(solves));
    updateDisplayedTimes(cumulativeTime);
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
