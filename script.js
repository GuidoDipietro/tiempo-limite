let timeLimitCentiseconds = 0;

function updateSolveFields() {
    const eventType = document.getElementById('event').value;
    const solveFields = document.getElementById('solve-fields');
    solveFields.innerHTML = '';
    const numSolves = parseInt(eventType);

    for (let i = 1; i <= numSolves; i++) {
        const div = document.createElement('div');
        div.className = 'solve-input';
        div.innerHTML = `
            <label>#${i}:</label>
            <input type="number" min="0" placeholder="Min" class="minutes" aria-label="Minutos del intento ${i}">
            <span class="separator">:</span>
            <input type="number" min="0" max="59" placeholder="Seg" class="seconds" aria-label="Segundos del intento ${i}">
            <span class="separator">.</span>
            <input type="number" min="0" max="99" placeholder="Centi" class="centiseconds" aria-label="Centisegundos del intento ${i}">
        `;
        solveFields.appendChild(div);
    }

    // Load saved solve times
    const savedSolves = JSON.parse(localStorage.getItem('solveTimes') || '{}');
    document.querySelectorAll('.solve-input').forEach((div, index) => {
        const solve = savedSolves[index] || {};
        div.querySelector('.minutes').value = solve.minutes || '';
        div.querySelector('.seconds').value = solve.seconds || '';
        div.querySelector('.centiseconds').value = solve.centiseconds || '';
    });

    // Add event listeners to solve inputs
    document.querySelectorAll('.solve-input input').forEach(input => {
        input.addEventListener('input', validateAndUpdate);
    });

    updateResults();
}

function validateAndUpdate(event) {
    const input = event.target;

    // Correct input values
    if (input.classList.contains('minutes') && input.value < 0) {
        input.value = '';
    } else if (input.classList.contains('seconds')) {
        if (input.value < 0) {
            input.value = '';
        } else if (input.value > 59) {
            input.value = 59;
        }
    } else if (input.classList.contains('centiseconds')) {
        if (input.value < 0) {
            input.value = '';
        } else if (input.value > 99) {
            input.value = 99;
        }
    }

    updateResults();
}

function validateTimeLimit(event) {
    const input = event.target;

    // Correct input values
    if (input.id === 'time-limit-min' && input.value < 0) {
        input.value = '';
    } else if (input.id === 'time-limit-sec') {
        if (input.value < 0) {
            input.value = '';
        } else if (input.value > 59) {
            input.value = 59;
        }
    }

    updateResults();
}

function updateResults() {
    // Update time limit in centiseconds
    const timeLimitMin = parseInt(document.getElementById('time-limit-min').value) || 0;
    const timeLimitSec = parseInt(document.getElementById('time-limit-sec').value) || 0;
    timeLimitCentiseconds = timeLimitMin * 60 * 100 + timeLimitSec * 100;

    // Save time limit to local storage
    localStorage.setItem('timeLimit', JSON.stringify({ minutes: timeLimitMin, seconds: timeLimitSec }));

    // Calculate total solve time in centiseconds
    let totalCentiseconds = 0;
    const solves = [];
    document.querySelectorAll('.solve-input').forEach(div => {
        const minutes = parseInt(div.querySelector('.minutes').value) || 0;
        const seconds = parseInt(div.querySelector('.seconds').value) || 0;
        const centiseconds = parseInt(div.querySelector('.centiseconds').value) || 0;
        totalCentiseconds += minutes * 60 * 100 + seconds * 100 + centiseconds;
        solves.push({ minutes, seconds, centiseconds });
    });

    // Save solve times to local storage
    localStorage.setItem('solveTimes', JSON.stringify(solves));

    const remainingCentiseconds = timeLimitCentiseconds - totalCentiseconds;

    // Format times as MM:SS.CC
    const formatTime = (centiseconds) => {
        const absoluteCentiseconds = Math.abs(centiseconds);
        const mins = Math.floor(absoluteCentiseconds / (60 * 100));
        const secs = Math.floor((absoluteCentiseconds % (60 * 100)) / 100);
        const centis = absoluteCentiseconds % 100;
        const sign = centiseconds < 0 ? '-' : '';
        return `${sign}${mins}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
    };

    document.getElementById('total-time').textContent = formatTime(totalCentiseconds);
    const remainingTimeElement = document.getElementById('remaining-time');
    remainingTimeElement.textContent = formatTime(remainingCentiseconds);
    remainingTimeElement.classList.toggle('negative', remainingCentiseconds < 0);
}

function resetAll() {
    document.getElementById('time-limit-min').value = '';
    document.getElementById('time-limit-sec').value = '';
    document.querySelectorAll('.solve-input input').forEach(input => {
        input.value = '';
    });
    localStorage.removeItem('timeLimit');
    localStorage.removeItem('solveTimes');
    updateResults();
}

function openHelpPopup() {
    document.getElementById('help-popup').style.display = 'flex';
    document.getElementById('help-popup').setAttribute('aria-hidden', 'false');
    document.querySelector('.close-button').focus();
}

function closeHelpPopup() {
    document.getElementById('help-popup').style.display = 'none';
    document.getElementById('help-popup').setAttribute('aria-hidden', 'true');
    document.querySelector('.help-button').focus();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load saved time limit
    const savedTimeLimit = JSON.parse(localStorage.getItem('timeLimit') || '{}');
    document.getElementById('time-limit-min').value = savedTimeLimit.minutes || '';
    document.getElementById('time-limit-sec').value = savedTimeLimit.seconds || '';

    // Add event listeners for time limit inputs
    document.getElementById('time-limit-min').addEventListener('input', validateTimeLimit);
    document.getElementById('time-limit-sec').addEventListener('input', validateTimeLimit);
    updateSolveFields();

    // Add keyboard support for popup
    document.getElementById('help-popup').addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeHelpPopup();
        }
    });
});
