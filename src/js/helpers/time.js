function parseTimeValue(value) {
    return value === '' ? 0 : parseInt(value) || 0;
}

function formatTime(centiseconds) {
    const abs = Math.abs(centiseconds);
    return `${centiseconds < 0 ? '-' : ''}${Math.floor(abs / 6000)}:${Math.floor((abs % 6000) / 100).toString().padStart(2, '0')}.${(abs % 100).toString().padStart(2, '0')}`;
}

function handleMinutesInput(div, skipUpdate = false) {
    const minutesInput = div.querySelector('.minutes');
    const centisecondsInput = div.querySelector('.centiseconds');
    const minutes = parseInt(minutesInput.value) || 0;

    if (minutes >= 10) {
        if (!centisecondsInput.disabled) {
            div.dataset.storedCentiseconds = centisecondsInput.value;
            centisecondsInput.value = '';
        }
        centisecondsInput.disabled = true;
    } else {
        if (centisecondsInput.disabled) {
            centisecondsInput.value = div.dataset.storedCentiseconds || '';
            delete div.dataset.storedCentiseconds;
        }
        centisecondsInput.disabled = false;
    }
    
    if (!skipUpdate) {
        updateResults();
    }
}
