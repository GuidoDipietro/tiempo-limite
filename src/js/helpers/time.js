function parseTimeValue(value) {
    return value === '' ? 0 : parseInt(value) || 0;
}

function formatTime(centiseconds) {
    const abs = Math.abs(centiseconds);
    return `${centiseconds < 0 ? '-' : ''}${Math.floor(abs / 6000)}:${Math.floor((abs % 6000) / 100).toString().padStart(2, '0')}.${(abs % 100).toString().padStart(2, '0')}`;
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
