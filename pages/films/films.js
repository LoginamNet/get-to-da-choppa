/* --imports------------------------------------------------------------------- */

import { navItems, removePreloader, setLocalStorage,  getLocalStorage } from "../../scripts/common.js";
import { enButton, ruButton, setLang, setLangStyle } from "../../scripts/translate.js";
import translations from "../../data/translation.js";
import filmsDataEn from "../../data/films_en.js";
import filmsDataRu from "../../data/films_ru.js";
import { setSongProgress, setVolumeLevel, getEndTime, muteAudio, setTimelineBar, setVolumeBar } from "../../scripts/player.js";

/* --const-lets------------------------------------------------------------------- */

const filmsCollection = document.querySelector('.films-collection');

let lang = `EN`;
let filmsData;
let sortedFilms;

/* --translation------------------------------------------------------------------- */

function setDataLang(lang) {
    let data;

    if (lang === 'EN') {
        data = filmsDataEn;
    } else if (lang === 'RU') {
        data = filmsDataRu;
    }

    return data;
}

function translate(lang) {
    for (let i = 0; i < navItems.length - 1; i++) {
        navItems[i].textContent = translations[lang].navItems[i];
    }

    filmsData = setDataLang(lang);
    sortedFilms = sortByYear(filmsData);

    filmsNowPlaying.textContent = translations[lang].filmsPlaingPlug;

    filmsCollection.innerHTML = ``;

    setFilms();
    setPlayerButtons();
}

enButton.addEventListener('click', (el) => {
    let filmIndex = getFilmIndex();
    
    lang = setLang(el);
    translate(lang);
    setLangStyle(lang);
    
    if (filmIndex) {
        filmsNowPlaying.textContent = sortedFilms[filmIndex].name;
    }
})

ruButton.addEventListener('click', (el) => {
    let filmIndex = getFilmIndex();

    lang = setLang(el);
    translate(lang);
    setLangStyle(lang);

    if (filmIndex) {
        filmsNowPlaying.textContent = sortedFilms[filmIndex].name;
    }
})

/* --player------------------------------------------------------------------- */

 function playAudio(audio, playBtn) {

    if (!isPlay) {
        
        audio.play();
        isPlay = true;
        playBtn.classList.toggle('pause');
        playBtn.classList.remove('repeat');


    } else {

        audio.pause();
        isPlay = false;
        playBtn.classList.toggle('pause');

    }
}

/* --films-player------------------------------------------------------------------- */

const play = document.querySelector('.player__play-button');
const filmsNowPlaying = document.querySelector('.player__now-playing');
const filmsVolumeBtn = document.querySelector('.player__volume-button');
const filmsVolumeBar = document.querySelector('.volume__volume-bar');
const filmsVolumeLevel = document.querySelector('.volume__volume-level');
const filmsTimelineBar = document.querySelector('.player__timeline-bar');
const filmsProgressBar = document.querySelector('.player__progress-bar');
const filmsTime = document.querySelector('.time-container__current-time');
const filmsEndTime = document.querySelector('.time-container__song-length');

let isPlay = false;

const audioFilms = new Audio();
audioFilms.volume = 0.90;
audioFilms.muted = false;

setInterval(() => setSongProgress(audioFilms, filmsTime, filmsProgressBar), 100);
setVolumeLevel(audioFilms, filmsVolumeLevel);

play.addEventListener('click', () => playAudio(audioFilms, play));
audioFilms.addEventListener('loadeddata', () => {
    play.classList.remove('button_disabled');
    getEndTime(audioFilms, filmsEndTime)
});
audioFilms.addEventListener('ended', () => {
    isPlay = false;
    play.classList.toggle('pause');
    play.classList.toggle('repeat');
})
filmsVolumeBtn.addEventListener('click', () => muteAudio(audioFilms, filmsVolumeBtn))
filmsVolumeBar.addEventListener('click', (el) => {
    setVolumeBar(el, audioFilms, filmsVolumeBar);
    setVolumeLevel(audioFilms, filmsVolumeLevel);
});
filmsTimelineBar.addEventListener('click', (el) => setTimelineBar(el, audioFilms, filmsTimelineBar));

/* --functions------------------------------------------------------------------- */

function sortByYear(data) {
    let sorted = [];

    for (let i = 0; i < data.length - 1; i++) {
        for (let item of data[i]) {
            sorted.push(item);
        }
        
    }

    sorted.sort((a, b) => a.year - b.year);

    return sorted;
}

function createFilmContainer(film, lang) {
    const filmContainer = document.createElement('div');
    filmContainer.classList.add('film__container');

    const filmDescriptionBox = document.createElement('div');
    filmDescriptionBox.classList.add('film__description-box');

    const filmImage = document.createElement('img');
    filmImage.classList.add('film__image');
    filmImage.style.backgroundImage = `url(${film.image})`;

    const filmMainBox = document.createElement('div');
    filmMainBox.classList.add('film__main-box');

    const filmName = document.createElement('p');
    filmName.classList.add('film__name');
    filmName.textContent = film.name;

    const filmYear = document.createElement('p');
    filmYear.classList.add('film__year');
    filmYear.textContent = film.year;

    filmMainBox.append(filmName, filmYear);

    const filmDescription = document.createElement('p');
    filmDescription.classList.add('film__description');
    filmDescription.textContent = film.description;

    filmDescriptionBox.append(filmImage, filmMainBox, filmDescription);

    const loadBtn = document.createElement('button');
    loadBtn.classList.add('button', 'load-button');
    loadBtn.setAttribute('value', film.audio)
    loadBtn.textContent = translations[lang].filmsLoadBtn;

    filmContainer.append (filmDescriptionBox, loadBtn);

    return filmContainer;
}

function getFilmIndex() {
    let filmIndex = false;

    for (let i = 0; i < sortedFilms.length; i++) {
        if (filmsNowPlaying.textContent === sortedFilms[i].name) {
            filmIndex = i;
        }
    }

    return filmIndex;
}

function setFilms() {
    for (let item of sortedFilms) {
        filmsCollection.append(createFilmContainer(item, lang));
    }
}

function setPlayerButtons() {
    let loadButtons = document.querySelectorAll('.load-button');
    
    for (let i = 0; i < loadButtons.length; i++) {
        loadButtons[i].addEventListener('click', () => {
            audioFilms.src = loadButtons[i].value;
            play.classList.remove('button_disabled', 'pause', 'repeat');
            filmsNowPlaying.textContent = sortedFilms[i].name;
    
            setTimeout(() => audioFilms.play(), 150);
            isPlay = true;
            play.classList.add('pause');
        })
    }
}

/* --event-listeners------------------------------------------------------------------- */

window.addEventListener('load', () => {
    lang = getLocalStorage(lang);
    
    translate(lang);
    setLangStyle(lang);
    setPlayerButtons();
    setTimeout(removePreloader, 1500);
});
window.addEventListener('beforeunload', () => setLocalStorage(lang));

