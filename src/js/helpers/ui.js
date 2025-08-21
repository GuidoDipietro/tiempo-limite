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
    inputs.minutes.value = solve.minutes !== undefined ? solve.minutes : '';
    inputs.seconds.value = solve.seconds !== undefined ? solve.seconds : '';
    inputs.centiseconds.value = solve.centiseconds !== undefined ? solve.centiseconds : '';
    
    if (solve.minutes !== undefined || solve.seconds !== undefined || solve.centiseconds !== undefined) {
        formatTimeField(inputs.seconds);
        formatTimeField(inputs.centiseconds);
    }
}

function handleLongTimeInput(div, inputs, solve) {
    if (parseInt(inputs.minutes.value) >= 10 && solve.centiseconds) {
        div.dataset.storedCentiseconds = solve.centiseconds;
        inputs.centiseconds.value = '';
        inputs.centiseconds.disabled = true;
    }
}

function setupInputEventListeners(input, div) {
    const events = {
        focus: () => updateTooltip(div),
        blur: () => {
            setTimeout(() => {
                if (!div.contains(document.activeElement)) {
                    const inputs = getSolveInputs(div);
                    const hasAnyValue = inputs.minutes.value !== '' || inputs.seconds.value !== '' || inputs.centiseconds.value !== '';
                    
                    if (hasAnyValue) {
                        formatTimeField(inputs.seconds);
                        if (!inputs.centiseconds.disabled) {
                            formatTimeField(inputs.centiseconds);
                        }
                        ensureNonEmptyFields(div);
                    }
                    updateResults();
                }
            }, 0);
            updateTooltip(div);
        },
        keydown: handleEnterKey,
        input: () => {
            const maxValue = getMaxValueForInput(input);
            validateInput(input, maxValue);
            if (input.classList.contains('minutes')) handleMinutesInput(div);
            if (input.classList.contains('seconds') || input.classList.contains('centiseconds')) div.querySelector('.tooltip').style.display = 'none';
            updateResults();
            updateTooltip(div);
        }
    };
    
    Object.entries(events).forEach(([event, handler]) => input.addEventListener(event, handler));
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
