const navItems = document.querySelectorAll('.page-nav__item');

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}

function removePreloader() {
    const page = document.querySelector('.page');
    const preloader = document.querySelector('.page-preloader');

    page.classList.remove('page_no-scroll');
    preloader.classList.add('page-preloader_hidden');
}

function setLocalStorage(lang) {
    localStorage.setItem('lang', lang); 
}

function getLocalStorage(lang) {

    if (localStorage.getItem('lang')) {
        lang = localStorage.getItem('lang');
        return lang;
    } else {
        return `EN`;
    }

}

export {navItems, getRandomNum, removePreloader, setLocalStorage, getLocalStorage}