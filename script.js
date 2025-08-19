let timeLimitCentiseconds = 0;

function createSolveInput(i) {
    return `
        <div class="solve-input">
            <label>#${i}:</label>
            <input type="number" min="0" placeholder="Min" class="minutes">
            <span class="separator">:</span>
            <input type="number" min="0" max="59" placeholder="Seg" class="seconds">
            <span class="separator">.</span>
            <input type="number" min="0" max="99" placeholder="Centi" class="centiseconds">
        </div>
    `;
}

function validateInput(input, max) {
    if (input.value < 0) input.value = '';
    if (max && input.value > max) input.value = max;
}

function updateSolveFields() {
    const numSolves = parseInt(document.getElementById('event').value);
    const solveFields = document.getElementById('solve-fields');
    solveFields.innerHTML = Array.from({ length: numSolves }, (_, i) => createSolveInput(i + 1)).join('');

    const savedSolves = JSON.parse(localStorage.getItem('solveTimes') || '{}');
    document.querySelectorAll('.solve-input').forEach((div, index) => {
        const solve = savedSolves[index] || {};
        div.querySelector('.minutes').value = solve.minutes || '';
        div.querySelector('.seconds').value = solve.seconds || '';
        div.querySelector('.centiseconds').value = solve.centiseconds || '';
    });

    document.querySelectorAll('.solve-input input').forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input, input.classList.contains('seconds') ? 59 : input.classList.contains('centiseconds') ? 99 : null);
            updateResults();
        });
    });

    updateResults();
}

function validateTimeLimit(event) {
    validateInput(event.target, event.target.id === 'time-limit-sec' ? 59 : null);
    updateResults();
}

function updateResults() {
    const timeLimitMin = parseInt(document.getElementById('time-limit-min').value) || 0;
    const timeLimitSec = parseInt(document.getElementById('time-limit-sec').value) || 0;
    timeLimitCentiseconds = timeLimitMin * 6000 + timeLimitSec * 100;

    localStorage.setItem('timeLimit', JSON.stringify({ minutes: timeLimitMin, seconds: timeLimitSec }));

    let totalCentiseconds = 0;
    const solves = [];
    document.querySelectorAll('.solve-input').forEach(div => {
        const minutes = parseInt(div.querySelector('.minutes').value) || 0;
        const seconds = parseInt(div.querySelector('.seconds').value) || 0;
        const centiseconds = parseInt(div.querySelector('.centiseconds').value) || 0;
        totalCentiseconds += minutes * 6000 + seconds * 100 + centiseconds;
        solves.push({ minutes, seconds, centiseconds });
    });

    localStorage.setItem('solveTimes', JSON.stringify(solves));

    const formatTime = centiseconds => {
        const abs = Math.abs(centiseconds);
        return `${centiseconds < 0 ? '-' : ''}${Math.floor(abs / 6000)}:${Math.floor((abs % 6000) / 100).toString().padStart(2, '0')}.${(abs % 100).toString().padStart(2, '0')}`;
    };

    document.getElementById('total-time').textContent = formatTime(totalCentiseconds);
    const remainingTimeElement = document.getElementById('remaining-time');
    remainingTimeElement.textContent = formatTime(timeLimitCentiseconds - totalCentiseconds);
    remainingTimeElement.classList.toggle('negative', timeLimitCentiseconds < totalCentiseconds);
}

function resetAll() {
    document.getElementById('time-limit-min').value = '';
    document.getElementById('time-limit-sec').value = '';
    document.querySelectorAll('.solve-input input').forEach(input => input.value = '');
    localStorage.removeItem('timeLimit');
    localStorage.removeItem('solveTimes');
    updateResults();
}

function openHelpPopup() {
    const popup = document.getElementById('help-popup');
    popup.style.display = 'flex';
    popup.setAttribute('aria-hidden', 'false');
}

function closeHelpPopup() {
    const popup = document.getElementById('help-popup');
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTimeLimit = JSON.parse(localStorage.getItem('timeLimit') || '{}');
    document.getElementById('time-limit-min').value = savedTimeLimit.minutes || '';
    document.getElementById('time-limit-sec').value = savedTimeLimit.seconds || '';

    document.getElementById('time-limit-min').addEventListener('input', validateTimeLimit);
    document.getElementById('time-limit-sec').addEventListener('input', validateTimeLimit);
    updateSolveFields();
});
