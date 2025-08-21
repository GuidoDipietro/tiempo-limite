function updateSolveState(div, timeLimitCentiseconds, remainingTime, solveTime, wouldExceed) {
    if (timeLimitCentiseconds > 0) {
        if (remainingTime <= 0 && solveTime === 0) {
            setSolveToDNS(div);
        } else if (wouldExceed) {
            showDNSWarning(div, true);
        } else {
            setSolveToNormal(div);
            showDNSWarning(div, false);
        }
    } else {
        if (solveTime === 0) {
            setSolveToDisabled(div);
        } else {
            setSolveToNormal(div);
        }
    }
}

function setSolveToDNS(div) {
    const inputs = div.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = true;
        input.value = '';
    });
    
    div.classList.add('dns-disabled');
    div.classList.remove('dnf-warning');
}

function setSolveToNormal(div) {
    const inputs = div.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = false;
    });
    
    div.classList.remove('dns-disabled', 'dnf-warning', 'disabled-no-limit');
}

function setSolveToDisabled(div) {
    const inputs = div.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = true;
        input.value = '';
    });
    
    div.classList.add('disabled-no-limit');
    div.classList.remove('dns-disabled', 'dnf-warning');
}

function showDNSWarning(div, show) {
    if (show) {
        div.classList.add('dnf-warning');
    } else {
        div.classList.remove('dnf-warning');
    }
}
