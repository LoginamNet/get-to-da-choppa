const enButton = document.querySelector('.nav__languages-en');
const ruButton = document.querySelector('.nav__languages-ru');

function setLang(el) {
    let target = el.target;

    if (target.textContent === `EN`) {
        enButton.classList.add('language-set');
        ruButton.classList.remove('language-set');
        return `EN`;
    } else if (target.textContent === `РУ`) {
        enButton.classList.remove('language-set');
        ruButton.classList.add('language-set');
        return `RU`;
    }
}

function setLangStyle(lang) {
    if (lang === `EN`) {
        enButton.classList.add('language-set');
        ruButton.classList.remove('language-set');
    } else {
        enButton.classList.remove('language-set');
        ruButton.classList.add('language-set');
    }
}

export {enButton, ruButton, setLang, setLangStyle};