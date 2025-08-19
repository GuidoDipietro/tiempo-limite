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
            <span class="tooltip" style="display: none;">Redondeá al segundo más cercano</span>
        </div>
    `;
}

function validateInput(input, max) {
    if (input.value < 0) input.value = '';
    if (max && input.value > max) input.value = max;
}

function handleMinutesInput(div) {
    const minutesInput = div.querySelector('.minutes');
    const secondsInput = div.querySelector('.seconds');
    const centisecondsInput = div.querySelector('.centiseconds');
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const centiseconds = parseInt(centisecondsInput.value) || 0;

    centisecondsInput.disabled = minutes >= 10;
    if (minutes < 10 || centiseconds === 0) return;

    const shouldRoundUp = centiseconds >= 50;
    minutesInput.value = shouldRoundUp && seconds >= 59 ? minutes + 1 : minutes;
    secondsInput.value = shouldRoundUp ? (seconds >= 59 ? 0 : seconds + 1) : seconds;
    centisecondsInput.value = '';
    updateResults();
}

function updateTooltip(div) {
    const minutesInput = div.querySelector('.minutes');
    const secondsInput = div.querySelector('.seconds');
    const tooltip = div.querySelector('.tooltip');
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const isFocused = [div.querySelector('.minutes'), div.querySelector('.seconds'), div.querySelector('.centiseconds')]
        .includes(document.activeElement);
    tooltip.style.display = minutes >= 10 && isFocused && secondsInput.value === '' ? 'inline' : 'none';
}

function updateSolveFields() {
    const numSolves = parseInt(document.getElementById('event').value);
    document.getElementById('solve-fields').innerHTML = Array.from({ length: numSolves }, (_, i) => createSolveInput(i + 1)).join('');

    const savedSolves = JSON.parse(localStorage.getItem('solveTimes') || '{}');
    document.querySelectorAll('.solve-input').forEach((div, index) => {
        const solve = savedSolves[index] || {};
        const inputs = {
            minutes: div.querySelector('.minutes'),
            seconds: div.querySelector('.seconds'),
            centiseconds: div.querySelector('.centiseconds')
        };
        inputs.minutes.value = solve.minutes || '';
        inputs.seconds.value = solve.seconds || '';
        inputs.centiseconds.value = solve.centiseconds || '';
        
        handleMinutesInput(div);
        updateTooltip(div);

        Object.values(inputs).forEach(input => {
            input.addEventListener('focus', () => updateTooltip(div));
            input.addEventListener('blur', () => updateTooltip(div));
            input.addEventListener('input', () => {
                validateInput(input, input.classList.contains('seconds') ? 59 : input.classList.contains('centiseconds') ? 99 : null);
                if (input.classList.contains('minutes')) handleMinutesInput(div);
                if (input.classList.contains('seconds') || input.classList.contains('centiseconds')) div.querySelector('.tooltip').style.display = 'none';
                updateResults();
                updateTooltip(div);
            });
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
    updateSolveFields();
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
