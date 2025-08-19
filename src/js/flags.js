function updateLanguageButton() {
	const toggleButton = document.getElementById('language-toggle');
	if (!toggleButton) return;
	const nextLang = window.currentLanguage === 'es' ? 'pt' : 'es';
	const flagKey = nextLang === 'pt' ? 'br' : 'ar';

	toggleButton.innerHTML = '';
	const img = document.createElement('img');
	img.src = window.flagIcons[flagKey];
	img.alt = nextLang === 'pt' ? 'Bandeira do Brasil' : 'Bandera de Argentina';
	img.style.width = '100%';
	img.style.height = '100%';
	img.style.borderRadius = '50%';
	img.onerror = function () {
		toggleButton.innerHTML = nextLang === 'pt' ? 'BR' : 'AR';
		toggleButton.style.fontSize = '12px';
		toggleButton.style.fontWeight = 'bold';
	};
	toggleButton.appendChild(img);
	
	toggleButton.setAttribute('aria-label', nextLang === 'es' ? 'Cambiar idioma' : 'Mudar idioma');
}

function toggleLanguage() {
	const newLang = window.currentLanguage === 'es' ? 'pt' : 'es';
	window.setLanguage(newLang);
}

window.updateLanguageButton = updateLanguageButton;
window.toggleLanguage = toggleLanguage;
