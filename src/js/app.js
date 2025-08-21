let timeLimitCentiseconds = 0;

function updateResults(skipSave = false) {
    const timeLimitMinInput = document.getElementById('time-limit-min').value;
    const timeLimitSecInput = document.getElementById('time-limit-sec').value;
    const timeLimitMin = parseTimeValue(timeLimitMinInput);
    const timeLimitSec = parseTimeValue(timeLimitSecInput);
    timeLimitCentiseconds = timeLimitMin * 6000 + timeLimitSec * 100;

    if (!skipSave) {
        if (timeLimitMinInput !== '' || timeLimitSecInput !== '') {
            localStorage.setItem('timeLimit', JSON.stringify({ minutes: timeLimitMin, seconds: timeLimitSec }));
        } else {
            localStorage.removeItem('timeLimit');
        }
    }

    let totalCentiseconds = 0;
    const solves = [];
    let remainingTime = timeLimitCentiseconds;
    
    document.querySelectorAll('.solve-input').forEach((div, index) => {
        const minutes = parseTimeValue(div.querySelector('.minutes').value);
        const seconds = parseTimeValue(div.querySelector('.seconds').value);
        const centiseconds = parseTimeValue(div.querySelector('.centiseconds').value);
        const solveTime = minutes * 6000 + seconds * 100 + centiseconds;
        
        const wouldExceed = solveTime > 0 && remainingTime - solveTime < 0;
        
        if (solveTime > 0) {
            totalCentiseconds += solveTime;
            remainingTime -= solveTime;
        }
        
        solves.push({ minutes, seconds, centiseconds });
        
        updateSolveState(div, timeLimitCentiseconds, remainingTime, solveTime, wouldExceed);
    });

    localStorage.setItem('solveTimes', JSON.stringify(solves));

    document.getElementById('total-time').textContent = formatTime(totalCentiseconds);
    const remainingTimeElement = document.getElementById('remaining-time');
    remainingTimeElement.textContent = formatTime(timeLimitCentiseconds - totalCentiseconds);
    remainingTimeElement.classList.toggle('negative', timeLimitCentiseconds < totalCentiseconds);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    loadSavedTimeLimit();
    loadSavedEventConfig();
    setupEventListeners();
    updateSolveFields();
    
    if (localStorage.getItem('timeLimit')) {
        updateResults(false);
    }
});

window.updateSolveFields = updateSolveFields;
