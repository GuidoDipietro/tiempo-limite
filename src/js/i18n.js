window.currentLanguage = window.currentLanguage || 'es';

function getText(key, replacements = {}) {
	const lang = window.currentLanguage;
	const dict = (window.translations && window.translations[lang]) || (window.translations && window.translations.es) || {};
	let text = dict[key] || key;

	Object.keys(replacements).forEach((placeholder) => {
		text = text.replace(`{${placeholder}}`, replacements[placeholder]);
	});

	return text;
}

function setLanguage(lang) {
	window.currentLanguage = lang;
	updatePageLanguage();
	updateAllText();
	if (typeof window.updateLanguageButton === 'function') {
		window.updateLanguageButton();
	}
}

function updatePageLanguage() {
	document.documentElement.lang = window.currentLanguage;
	document.title = getText('pageTitle');
}

function updateAllText() {
	document.querySelector('h1').textContent = getText('mainHeading');

	document.querySelector('label[for="event"]').textContent = getText('eventLabel');
	document.querySelector('#event').setAttribute('aria-label', getText('eventSelectLabel'));
	const eventSelect = document.querySelector('#event');
	if (eventSelect && eventSelect.options.length >= 2) {
		eventSelect.options[0].textContent = getText('eventOption1');
		eventSelect.options[1].textContent = getText('eventOption2');
	}

	const timeLimitLabel = document.querySelector('.time-limit-section label');
	if (timeLimitLabel) timeLimitLabel.textContent = getText('timeLimitLabel');
	const minEl = document.querySelector('#time-limit-min');
	const secEl = document.querySelector('#time-limit-sec');
	if (minEl) {
		minEl.setAttribute('aria-label', getText('timeLimitMinLabel'));
		minEl.placeholder = getText('minPlaceholder');
	}
	if (secEl) {
		secEl.setAttribute('aria-label', getText('timeLimitSecLabel'));
		secEl.placeholder = getText('secPlaceholder');
	}

	const solvesRegion = document.querySelector('#solve-fields');
	if (solvesRegion) solvesRegion.setAttribute('aria-label', getText('solveFieldsLabel'));

	const totalP = document.querySelector('.result p:first-child');
	const remainingP = document.querySelector('.result p:last-child');
	if (totalP) totalP.innerHTML = `${getText('totalTimeUsed')} <span id="total-time" aria-live="polite">0:00.00</span>`;
	if (remainingP) remainingP.innerHTML = `${getText('remainingTime')} <span id="remaining-time" aria-live="polite">0:00.00</span>`;

	const resetBtn = document.querySelector('.reset-button');
	const helpBtn = document.querySelector('.help-button');
	if (resetBtn) resetBtn.textContent = getText('resetButton');
	if (helpBtn) helpBtn.textContent = getText('helpButton');

	const popupTitle = document.querySelector('#popup-title');
	if (popupTitle) popupTitle.textContent = getText('helpTitle');
	const helpParagraphs = document.querySelectorAll('.popup-content p');
	if (helpParagraphs[0]) helpParagraphs[0].textContent = getText('helpDescription1');
	if (helpParagraphs[1]) helpParagraphs[1].textContent = getText('helpDescription2');
	const helpLinkParagraph = document.getElementById('help-links');
	if (helpLinkParagraph) {
		helpLinkParagraph.innerHTML = `${getText('helpDescription3')} <a href="${getText('wcaRegulationsUrl')}" target="_blank" rel="noopener noreferrer">${getText('helpDescription4')} <bold>(A1a2)</bold></a> ${getText('helpDescription5')} <a href="${getText('exampleUrl')}" target="_blank" rel="noopener noreferrer">${getText('helpDescription6')}</a>${getText('helpDescription7')}`;
	}
	const closeBtn = document.querySelector('.close-button');
	if (closeBtn) {
		closeBtn.textContent = getText('closeButton');
		closeBtn.setAttribute('aria-label', getText('closeButtonLabel'));
	}

	if (typeof window.updateSolveFields === 'function') {
		window.updateSolveFields();
	}
}

window.getText = getText;
window.setLanguage = setLanguage;
window.updatePageLanguage = updatePageLanguage;
window.updateAllText = updateAllText;


