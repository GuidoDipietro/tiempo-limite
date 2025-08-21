function parseTimeValue(value) {
    return value === '' ? 0 : parseInt(value) || 0;
}

function formatTime(centiseconds) {
    const abs = Math.abs(centiseconds);
    return `${centiseconds < 0 ? '-' : ''}${Math.floor(abs / 6000)}:${Math.floor((abs % 6000) / 100).toString().padStart(2, '0')}.${(abs % 100).toString().padStart(2, '0')}`;
}

function timeToCentiseconds(minutes, seconds, centiseconds) {
    return minutes * 6000 + seconds * 100 + centiseconds;
}

function centisecondsToTime(centiseconds) {
    return {
        minutes: Math.floor(centiseconds / 6000),
        seconds: Math.floor((centiseconds % 6000) / 100),
        centiseconds: centiseconds % 100
    };
}

function handleMinutesInput(div, skipUpdate = false) {
    const minutesInput = div.querySelector('.minutes');
    const centisecondsInput = div.querySelector('.centiseconds');
    const minutes = parseInt(minutesInput.value) || 0;

    if (minutes >= 10) {
        if (!centisecondsInput.disabled && centisecondsInput.value !== '') {
            div.dataset.storedCentiseconds = centisecondsInput.value;
            centisecondsInput.value = '';
        }
        centisecondsInput.disabled = true;
        centisecondsInput.placeholder = '';
    } else {
        if (centisecondsInput.disabled) {
            centisecondsInput.value = div.dataset.storedCentiseconds || '';
            delete div.dataset.storedCentiseconds;
        }
        centisecondsInput.disabled = false;
        centisecondsInput.placeholder = getText('centiPlaceholder');
    }
    
    if (!skipUpdate) {
        updateResults();
    }
}
