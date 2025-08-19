let timeLimitSeconds = 0;

function updateSolveFields() {
    const eventType = document.getElementById('event').value;
    const solveFields = document.getElementById('solve-fields');
    solveFields.innerHTML = '';
    const numSolves = parseInt(eventType);

    for (let i = 1; i <= numSolves; i++) {
        const div = document.createElement('div');
        div.className = 'solve-input';
        div.innerHTML = `
            <label>Intento ${i}:</label>
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
    let isValid = true;

    // Validate input
    if (input.classList.contains('minutes') && input.value < 0) {
        input.value = '';
        isValid = false;
    }
    if (input.classList.contains('seconds') && (input.value < 0 || input.value > 59)) {
        input.value = input.value < 0 ? '' : (input.value > 59 ? 59 : input.value);
        isValid = false;
    }
    if (input.classList.contains('centiseconds') && (input.value < 0 || input.value > 99)) {
        input.value = input.value < 0 ? '' : (input.value > 99 ? 99 : input.value);
        isValid = false;
    }

    input.classList.toggle('invalid', !isValid);
    updateResults();
}

function updateResults() {
    // Update time limit
    const timeLimitMin = parseFloat(document.getElementById('time-limit-min').value) || 0;
    const timeLimitSec = parseFloat(document.getElementById('time-limit-sec').value) || 0;
    timeLimitSeconds = timeLimitMin * 60 + timeLimitSec;

    // Validate time limit inputs
    document.getElementById('time-limit-min').classList.toggle('invalid', timeLimitMin < 0);
    document.getElementById('time-limit-sec').classList.toggle('invalid', timeLimitSec < 0 || timeLimitSec > 59);

    // Save time limit to local storage
    localStorage.setItem('timeLimit', JSON.stringify({ minutes: timeLimitMin, seconds: timeLimitSec }));

    // Calculate total solve time
    let totalSeconds = 0;
    const solves = [];
    document.querySelectorAll('.solve-input').forEach(div => {
        const minutes = parseFloat(div.querySelector('.minutes').value) || 0;
        const seconds = parseFloat(div.querySelector('.seconds').value) || 0;
        const centiseconds = parseFloat(div.querySelector('.centiseconds').value) || 0;
        totalSeconds += minutes * 60 + seconds + centiseconds / 100;
        solves.push({ minutes, seconds, centiseconds });
    });

    // Save solve times to local storage
    localStorage.setItem('solveTimes', JSON.stringify(solves));

    const remainingSeconds = timeLimitSeconds - totalSeconds;

    // Format times as MM:SS.CC
    const formatTime = (seconds) => {
        const absoluteSeconds = Math.abs(seconds);
        const mins = Math.floor(absoluteSeconds / 60);
        const secs = Math.floor(absoluteSeconds % 60);
        const centis = Math.floor((absoluteSeconds % 1) * 100);
        const sign = seconds < 0 ? '-' : '';
        return `${sign}${mins}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
    };

    document.getElementById('total-time').textContent = formatTime(totalSeconds);
    const remainingTimeElement = document.getElementById('remaining-time');
    remainingTimeElement.textContent = formatTime(remainingSeconds);
    remainingTimeElement.classList.toggle('negative', remainingSeconds < 0);
}

function resetAll() {
    document.getElementById('time-limit-min').value = '';
    document.getElementById('time-limit-sec').value = '';
    document.querySelectorAll('.solve-input input').forEach(input => {
        input.value = '';
        input.classList.remove('invalid');
    });
    localStorage.removeItem('timeLimit');
    localStorage.removeItem('solveTimes');
    updateResults();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load saved time limit
    const savedTimeLimit = JSON.parse(localStorage.getItem('timeLimit') || '{}');
    document.getElementById('time-limit-min').value = savedTimeLimit.minutes || '';
    document.getElementById('time-limit-sec').value = savedTimeLimit.seconds || '';

    document.getElementById('time-limit-min').addEventListener('input', validateAndUpdate);
    document.getElementById('time-limit-sec').addEventListener('input', validateAndUpdate);
    updateSolveFields();
});
