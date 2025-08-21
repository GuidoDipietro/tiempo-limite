function validateInput(input, max) {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value < 0) input.value = '';
    if (max && input.value > max) input.value = max;
}

function formatTimeField(input) {
    if (input.classList.contains('seconds') || input.classList.contains('centiseconds') || input.id === 'time-limit-sec') {
        if (input.value === '') {
            input.value = '00';
        } else {
            const num = parseInt(input.value);
            if (!isNaN(num)) {
                input.value = num.toString().padStart(2, '0');
            }
        }
    }
}

function ensureNonEmptyFields(div) {
    const inputs = div.querySelectorAll('input');
    const hasAnyValue = Array.from(inputs).some(input => {
        const value = parseInt(input.value) || 0;
        return value > 0;
    });
    
    if (hasAnyValue) {
        inputs.forEach(input => {
            if ((input.classList.contains('seconds') || input.classList.contains('centiseconds')) && input.value === '' && !input.disabled) {
                input.value = '00';
            }
        });
    }
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
