function initializeLanguage() {
    loadSavedLanguage();
    if (typeof updatePageLanguage === 'function') updatePageLanguage();
    if (typeof updateAllText === 'function') updateAllText();
    if (typeof updateLanguageButton === 'function') updateLanguageButton();
}

function loadSavedLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) setLanguage(savedLanguage);
}

function saveLanguage(language) {
    localStorage.setItem('language', language);
}

function loadSavedTimeLimit() {
    const savedTimeLimit = localStorage.getItem('timeLimit');
    if (savedTimeLimit) {
        const parsed = JSON.parse(savedTimeLimit);
        document.getElementById('time-limit-min').value = parsed.minutes || '';
        document.getElementById('time-limit-sec').value = parsed.seconds || '';
        formatTimeField(document.getElementById('time-limit-sec'));
    } else {
        document.getElementById('time-limit-min').value = '';
        document.getElementById('time-limit-sec').value = '';
    }
}

function loadSavedEventConfig() {
    const savedEventConfig = localStorage.getItem('eventConfig');
    if (savedEventConfig) {
        const eventSelect = document.getElementById('event');
        eventSelect.value = savedEventConfig;
    }
}

function saveEventConfig(eventValue) {
    localStorage.setItem('eventConfig', eventValue);
}

function setupEventListeners() {
    document.getElementById('time-limit-min').addEventListener('input', validateTimeLimit);
    document.getElementById('time-limit-sec').addEventListener('input', validateTimeLimit);
    document.getElementById('time-limit-min').addEventListener('keydown', handleEnterKey);
    document.getElementById('time-limit-sec').addEventListener('keydown', handleEnterKey);
    
    const timeLimitBlurHandler = () => {
        setTimeout(() => {
            const timeLimitInput = document.querySelector('.time-limit-input');
            if (!timeLimitInput.contains(document.activeElement)) {
                const secondsInput = document.getElementById('time-limit-sec');
                const minutesInput = document.getElementById('time-limit-min');
                if (minutesInput.value !== '' || secondsInput.value !== '') {
                    formatTimeField(secondsInput);
                }
            }
        }, 0);
    };
    
    document.getElementById('time-limit-min').addEventListener('blur', timeLimitBlurHandler);
    document.getElementById('time-limit-sec').addEventListener('blur', timeLimitBlurHandler);
    
    const eventSelect = document.getElementById('event');
    eventSelect.addEventListener('change', (event) => {
        saveEventConfig(event.target.value);
        updateSolveFields();
    });
}

function resetAll() {
    document.getElementById('time-limit-min').value = '';
    document.getElementById('time-limit-sec').value = '';
    document.querySelectorAll('.solve-input input').forEach(input => input.value = '');
    document.querySelectorAll('.solve-input').forEach(div => {
        div.classList.remove('dns-disabled', 'dnf-warning', 'disabled-no-limit');
    });
    localStorage.removeItem('timeLimit');
    localStorage.removeItem('solveTimes');
    updateSolveFields();
}
