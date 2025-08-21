function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
        const currentIndex = inputs.indexOf(event.target);
        const nextInput = inputs[currentIndex + 1];
        if (nextInput) {
            nextInput.focus();
        }
    }
}

function updateTooltip(div) {
    const minutesInput = div.querySelector('.minutes');
    const secondsInput = div.querySelector('.seconds');
    const tooltip = div.querySelector('.tooltip');
    const minutes = parseInt(minutesInput.value) || 0;
    const inputs = [minutesInput, secondsInput, div.querySelector('.centiseconds')];
    const isFocused = inputs.includes(document.activeElement);
    const shouldShowTooltip = minutes >= 10 && isFocused && secondsInput.value === '';
    tooltip.style.display = shouldShowTooltip ? 'inline' : 'none';
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

function getSolveInputs(div) {
    return {
        minutes: div.querySelector('.minutes'),
        seconds: div.querySelector('.seconds'),
        centiseconds: div.querySelector('.centiseconds')
    };
}

function loadSolveValues(inputs, solve) {
    inputs.minutes.value = solve.minutes || '';
    inputs.seconds.value = solve.seconds || '';
    inputs.centiseconds.value = solve.centiseconds || '';
}

function handleLongTimeInput(div, inputs, solve) {
    if (parseInt(inputs.minutes.value) >= 10 && solve.centiseconds) {
        div.dataset.storedCentiseconds = solve.centiseconds;
        inputs.centiseconds.value = '';
        inputs.centiseconds.disabled = true;
    }
}

function setupInputEventListeners(input, div) {
    input.addEventListener('focus', () => updateTooltip(div));
    input.addEventListener('blur', () => updateTooltip(div));
    input.addEventListener('keydown', handleEnterKey);
    input.addEventListener('input', () => {
        const maxValue = getMaxValueForInput(input);
        validateInput(input, maxValue);
        if (input.classList.contains('minutes')) handleMinutesInput(div);
        if (input.classList.contains('seconds') || input.classList.contains('centiseconds')) div.querySelector('.tooltip').style.display = 'none';
        updateResults();
        updateTooltip(div);
    });
}

function setupSolveInput(div, solve) {
    const inputs = getSolveInputs(div);
    
    loadSolveValues(inputs, solve);
    handleLongTimeInput(div, inputs, solve);
    
    handleMinutesInput(div, true);
    updateTooltip(div);

    Object.values(inputs).forEach(input => setupInputEventListeners(input, div));
}

function updateSolveFields() {
    const numSolves = parseInt(document.getElementById('event').value);
    document.getElementById('solve-fields').innerHTML = Array.from({ length: numSolves }, (_, i) => createSolveInput(i + 1)).join('');

    const savedSolves = JSON.parse(localStorage.getItem('solveTimes') || '{}');
    document.querySelectorAll('.solve-input').forEach((div, index) => {
        setupSolveInput(div, savedSolves[index] || {});
    });

    updateResults(true);
}

function createSolveInput(i) {
    return `
        <div class="solve-input">
            <label>${getText('solveLabel', { number: i })}</label>
            <input type="number" min="0" placeholder="${getText('minPlaceholder')}" class="minutes">
            <span class="separator">:</span>
            <input type="number" min="0" max="59" placeholder="${getText('secPlaceholder')}" class="seconds">
            <span class="separator">.</span>
            <input type="number" min="0" max="99" placeholder="${getText('centiPlaceholder')}" class="centiseconds">
            <span class="tooltip" style="display: none;">${getText('tooltipText')}</span>
        </div>
    `;
}
