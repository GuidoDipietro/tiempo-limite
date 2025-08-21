function updateSolveState(div, state) {
    const { timeLimitCentiseconds, remainingTime, solveTime, wouldExceed, firstDNFIndex, currentIndex } = state;
    
    if (timeLimitCentiseconds === 0) {
        setSolveToDisabled(div);
        return;
    }
    
    if (remainingTime <= 0 && solveTime === 0 || firstDNFIndex !== -1 && currentIndex > firstDNFIndex) {
        setSolveToDNS(div);
    } else if (wouldExceed) {
        showDNSWarning(div, true);
    } else {
        setSolveToNormal(div);
        showDNSWarning(div, false);
    }
}

function setSolveToDNS(div) {
    const inputs = div.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = true;
    });
    
    div.classList.add('dns-disabled');
    div.classList.remove('dnf-warning');
}

function setInputStates(div, disabled = false) {
    const inputs = div.querySelectorAll('input');
    const minutesInput = div.querySelector('.minutes');
    const minutes = parseInt(minutesInput.value) || 0;
    
    inputs.forEach(input => {
        if (input.classList.contains('centiseconds') && minutes >= 10) {
            input.disabled = true;
        } else {
            input.disabled = disabled;
        }
    });
}

function setSolveToNormal(div) {
    setInputStates(div, false);
    div.classList.remove('dns-disabled', 'dnf-warning', 'disabled-no-limit');
}

function setSolveToDisabled(div) {
    const inputs = div.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = true;
    });
    
    div.classList.add('disabled-no-limit');
    div.classList.remove('dns-disabled', 'dnf-warning');
}

function showDNSWarning(div, show) {
    if (show) {
        setInputStates(div, false);
        div.classList.add('dnf-warning');
        div.classList.remove('dns-disabled');
    } else {
        div.classList.remove('dnf-warning');
    }
}
