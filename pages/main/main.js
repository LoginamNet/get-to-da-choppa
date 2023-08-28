/* --imports------------------------------------------------------------------- */

import { navItems, removePreloader, setLocalStorage,  getLocalStorage } from "../../scripts/common.js";
import { enButton, ruButton, setLang, setLangStyle } from "../../scripts/translate.js";
import translations from "../../data/translation.js";

/* --const-lets------------------------------------------------------------------- */

const greetingsText = document.querySelector('.main-text__greetings');
const waitingText = document.querySelector('.main-text__waiting');

let lang = `EN`;

/* --translate------------------------------------------------------------------- */

function translate(lang) {
    for (let i = 0; i < navItems.length - 1; i++) {
        navItems[i].textContent = translations[lang].navItems[i];
    }

    greetingsText.textContent = translations[lang].mainGreeting;
    waitingText.textContent = translations[lang].mainWaiting;
}

enButton.addEventListener('click', (el) => {
    lang = setLang(el);
    translate(lang);

})

ruButton.addEventListener('click', (el) => {
    lang = setLang(el);
    translate(lang);
})

/* --event-listeners------------------------------------------------------------------- */

window.addEventListener('load', () => {
    lang = getLocalStorage(lang);
    
    translate(lang);
    setLangStyle(lang);
    setTimeout(removePreloader, 1500);
});
window.addEventListener('beforeunload', () => setLocalStorage(lang));