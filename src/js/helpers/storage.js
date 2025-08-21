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
    localStorage.removeItem('eventConfig');
    localStorage.removeItem('language');
    updateSolveFields();
}
