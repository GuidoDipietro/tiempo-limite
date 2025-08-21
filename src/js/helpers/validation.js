function validateInput(input, max) {
    if (input.value < 0) input.value = '';
    if (max && input.value > max) input.value = max;
}

function getMaxValueForInput(input) {
    if (input.classList.contains('seconds') || input.id === 'time-limit-sec') return 59;
    if (input.classList.contains('centiseconds')) return 99;
    if (input.classList.contains('minutes') || input.id === 'time-limit-min') return 120;
    return null;
}

function validateTimeLimit(event) {
    const maxValue = getMaxValueForInput(event.target);
    validateInput(event.target, maxValue);
    updateResults();
}
