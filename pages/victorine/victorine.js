/* --imports------------------------------------------------------------------- */

import { navItems, removePreloader, setLocalStorage,  getLocalStorage } from "../../scripts/common.js";
import { enButton, ruButton, setLang, setLangStyle } from "../../scripts/translate.js";
import translations from "../../data/translation.js";
import filmsDataEn from "../../data/films_en.js";
import filmsDataRu from "../../data/films_ru.js";
import { getRandomNum } from "../../scripts/common.js";
import { getSongTime, setSongProgress, setVolumeLevel, getEndTime, muteAudio, setTimelineBar, setVolumeBar } from "../../scripts/player.js";

/* --const-lets------------------------------------------------------------------- */

const unknownFilmImg = document.querySelector('.question__img');
const unknownFilmName = document.querySelector('.question__text');

let lang = `EN`;
let filmsData;
let score = 0;
let taskScore = 5;
let currentTaskNum = 0;


const filmPoster = document.querySelector('.films-info__film-poster');
const filmName = document.querySelector('.film-info__name');
const filmDescription = document.querySelector('.film-info__description');
const filmInfoPlug = document.querySelector('.films-info__info-plug');
const questionsItems = document.querySelectorAll('.questions-list__item');
const questionsScore = document.querySelector('.questions-score');
const answersItems = document.querySelectorAll('.answers-list__item');
const nextTaskButton = document.querySelector('.next-task__next-button');
const scoreText = document.querySelector('.questions-score_text');
const vicPlugText = document.querySelector('.info-plug__text');

/* --translate------------------------------------------------------------------- */

function setDataLang(lang) {
    let data;

    if (lang === 'EN') {
        data = filmsDataEn;
    } else if (lang === 'RU') {
        data = filmsDataRu;
    }

    return data;
}

filmsData = setDataLang(lang);

let taskQuestion = getRandomNum(0, filmsData[currentTaskNum].length);
unknownFilmImg.style.backgroundImage = `url('../../assets/images/liquid_stiker.jpg')`;
unknownFilmName.textContent = filmsData[currentTaskNum][taskQuestion].name;
questionsItems[currentTaskNum].classList.add('questions-list__item_current');

function translate(lang) {
    for (let i = 0; i < navItems.length - 1; i++) {
        navItems[i].textContent = translations[lang].navItems[i];
    }

    filmsData = setDataLang(lang);

    for (let i = 0; i < questionsItems.length; i++) {
        questionsItems[i].textContent = translations[lang].vicQuestions[i];
    }

    unknownFilmName.textContent = filmsData[currentTaskNum][taskQuestion].name;

    for (let i = 0; i < answersItems.length; i++) {
        answersItems[i].textContent = filmsData[currentTaskNum][i].name;
        filmName.textContent = filmsData[currentTaskNum][i].name;
        filmDescription.textContent = filmsData[currentTaskNum][i].description;
    }

    (currentTaskNum < filmsData.length - 1) ? nextTaskButton.textContent = translations[lang].vicNext : nextTaskButton.textContent = translations[lang].vicResults;
    scoreText.textContent = translations[lang].vicScoreText;
    vicPlugText.textContent = translations[lang].vicPlugText;
}

enButton.addEventListener('click', (el) => {
    lang = setLang(el);
    translate(lang);
    setLangStyle(lang);
})

ruButton.addEventListener('click', (el) => {
    lang = setLang(el);
    translate(lang);
    setLangStyle(lang);
})

/* --sounds------------------------------------------------------------------- */

const wrongSound = new Audio();
wrongSound.volume = 0.75;
wrongSound.src = '../../assets/sounds/wrong_sound.mp3';

const correctSound = new Audio();
correctSound.volume = 0.75;
correctSound.src = '../../assets/sounds/correct_sound.mp3';

/* --player------------------------------------------------------------------- */

function playAudio(audio, playBtn1, playBtn2) {

    if (!isPlay) {
        
        audio.play();
        isPlay = true;
        playBtn1.classList.toggle('pause');
        playBtn1.classList.remove('repeat');
        playBtn2.classList.add('button_disabled');


    } else {

        audio.pause();
        isPlay = false;
        playBtn1.classList.toggle('pause');
        playBtn2.classList.remove('button_disabled');

    }
}

/* --main-player------------------------------------------------------------------- */

const play = document.querySelector('.player__play-button');
const questionVolumeBtn = document.querySelector('.player__volume-button');
const questionVolumeBar = document.querySelector('.volume__volume-bar');
const questionVolumeLevel = document.querySelector('.volume__volume-level');
const questionTimelineBar = document.querySelector('.player__timeline-bar');
const quiestionProgressBar = document.querySelector('.player__progress-bar');
const questionTime = document.querySelector('.time-container__current-time');
const questionEndTime = document.querySelector('.time-container__song-length');

let isPlay = false;

const audioQuestion = new Audio();
audioQuestion.src = filmsData[currentTaskNum][taskQuestion].audio;
audioQuestion.volume = 0.90;
audioQuestion.muted = false;


setInterval(() => setSongProgress(audioQuestion, questionTime, quiestionProgressBar), 100);
setVolumeLevel(audioQuestion, questionVolumeLevel);

play.addEventListener('click', () => playAudio(audioQuestion, play, playInfo));
audioQuestion.addEventListener('loadeddata', () => {
    play.classList.remove('button_disabled');
    getEndTime(audioQuestion, questionEndTime)
});
audioQuestion.addEventListener('ended', () => {
    isPlay = false;
    play.classList.toggle('pause');
    play.classList.toggle('repeat');
    playInfo.classList.remove('button_disabled');
})
questionVolumeBtn.addEventListener('click', () => muteAudio(audioQuestion, questionVolumeBtn))
questionVolumeBar.addEventListener('click', (el) => {
    setVolumeBar(el, audioQuestion, questionVolumeBar);
    setVolumeLevel(audioQuestion, questionVolumeLevel);
});
questionTimelineBar.addEventListener('click', (el) => setTimelineBar(el, audioQuestion, questionTimelineBar));

/* --info-player------------------------------------------------------------------- */

const playInfo = document.querySelector('.info-player__play-button');
const infoVolumeBtn = document.querySelector('.info-player__volume-button');
const infoVolumeBar = document.querySelector('.info-player__volume-bar');
const infoVolumeLevel = document.querySelector('.info-player__volume-level');
const infoTimelineBar = document.querySelector('.info-player__timeline-bar');
const infoProgressBar = document.querySelector('.info-player__progress-bar');
const infoTime = document.querySelector('.info-player__current-time');
const infoEndTime = document.querySelector('.info-player__song-length');

const audioInfo = new Audio();
audioInfo.volume = 0.90;
audioInfo.muted = false;


setInterval(() => setSongProgress(audioInfo, infoTime, infoProgressBar), 100);
setVolumeLevel(audioInfo, infoVolumeLevel);

playInfo.addEventListener('click', () => playAudio(audioInfo, playInfo, play));
audioInfo.addEventListener('loadeddata', () => {
    getEndTime(audioInfo, infoEndTime)
});
audioInfo.addEventListener('ended', () => {
    isPlay = false;
    playInfo.classList.toggle('pause');
    playInfo.classList.toggle('repeat');
    play.classList.remove('button_disabled');
})
infoVolumeBtn.addEventListener('click', () => muteAudio(audioInfo, infoVolumeBtn))
infoVolumeBar.addEventListener('click', (el) => {
    setVolumeBar(el, audioInfo, infoVolumeBar);
    setVolumeLevel(audioInfo, infoVolumeLevel);
});
infoTimelineBar.addEventListener('click', (el) => setTimelineBar(el, audioInfo, infoTimelineBar));

/* --check-correct------------------------------------------------------------------- */

for (let i = 0; i < answersItems.length; i++) {
    answersItems[i].textContent = filmsData[currentTaskNum][i].name;

    answersItems[i].addEventListener('click', () => {
        if (answersItems[i].textContent === unknownFilmName.textContent && nextTaskButton.classList.contains('button_disabled')) {
            correctSound.play();
            
            unknownFilmImg.style.backgroundImage = `url('${filmsData[currentTaskNum][i].image}')`;
            unknownFilmName.classList.remove('question__text_hidden');
            answersItems[i].classList.add('answers-list__item_correct');

            audioQuestion.pause();
            isPlay = false;
            play.classList.remove('button_disabled', 'pause');
            playInfo.classList.remove('button_disabled', 'pause');
        

            score += taskScore;
            questionsScore.textContent = score;

            nextTaskButton.classList.remove('button_disabled');
        } else if (answersItems[i].textContent !== unknownFilmName.textContent && nextTaskButton.classList.contains('button_disabled')){
            
            if (!answersItems[i].classList.contains('answers-list__item_disabled')) {
                wrongSound.play();
            }

            taskScore--;
            answersItems[i].classList.add('answers-list__item_disabled');

            play.classList.remove('button_disabled');
            isPlay ? playInfo.classList.add('button_disabled'): playInfo.classList.remove('button_disabled');
        }
    })
}

/* --next-button------------------------------------------------------------------- */

nextTaskButton.addEventListener('click', () => {
    if (currentTaskNum < filmsData.length - 1) {
        taskScore = 5;

        unknownFilmImg.style.backgroundImage = `url('../../assets/images/liquid_stiker.jpg')`;
        unknownFilmName.classList.add('question__text_hidden');
        nextTaskButton.classList.add('button_disabled');
        filmInfoPlug.classList.remove('films-info__info-plug_hidden');

        play.classList.add('button_disabled');
        play.classList.remove('repeat');
        questionEndTime.textContent = `00:00`;

        playInfo.classList.add('button_disabled');
        playInfo.classList.remove('pause');
        infoEndTime.textContent = `00:00`;

        questionsItems[currentTaskNum].classList.remove('questions-list__item_current');
        questionsItems[currentTaskNum].classList.add('questions-list__item_done');

        currentTaskNum++;

        if (currentTaskNum === filmsData.length - 1) {
            nextTaskButton.textContent = translations[lang].vicResults;
        }

        questionsItems[currentTaskNum].classList.add('questions-list__item_current');

        for (let i = 0; i < answersItems.length; i++) {
            answersItems[i].classList.remove('answers-list__item_correct');
            answersItems[i].classList.remove('answers-list__item_disabled');
        }

        taskQuestion = getRandomNum(0, filmsData[currentTaskNum].length);

        unknownFilmImg.style.backgroundImage = `url('../../assets/images/liquid_stiker.jpg')`;
        unknownFilmName.textContent = filmsData[currentTaskNum][taskQuestion].name;
        
        audioQuestion.src = filmsData[currentTaskNum][taskQuestion].audio;
        audioInfo.src = '';
        isPlay = false;
        play.classList.remove('pause');

        for (let i = 0; i < answersItems.length; i++) {
            answersItems[i].textContent = filmsData[currentTaskNum][i].name;
        }
    } else {
        questionsItems[currentTaskNum].classList.remove('questions-list__item_current');
        questionsItems[currentTaskNum].classList.add('questions-list__item_done');
        createResult(lang);
    }


})

/* --fill-info------------------------------------------------------------------- */

for (let i = 0; i < answersItems.length; i++) {
    answersItems[i].addEventListener('click', () => {
        playInfo.classList.remove('repeat');

        audioInfo.src = filmsData[currentTaskNum][i].audio;

        if (playInfo.classList.contains('pause')) {
            play.classList.remove('button_disabled');
            playInfo.classList.remove('pause', 'button_disabled');
            isPlay = false;
        }


        filmPoster.style.backgroundImage = `url(${filmsData[currentTaskNum][i].image})`;
        filmName.textContent = `${filmsData[currentTaskNum][i].name} | ${filmsData[currentTaskNum][i].year}`;
        filmDescription.textContent = filmsData[currentTaskNum][i].description;

        filmInfoPlug.classList.add('films-info__info-plug_hidden');
    })
}

/* --results-popup------------------------------------------------------------------- */

function createResult(lang) {
    const page = document.querySelector('.page');

    const resultPage = document.createElement('div');
    resultPage.classList.add('results');

    const resultContainer = document.createElement('div');
    resultContainer.classList.add('results__container');

    const resultsWinGif = document.createElement('div');
    resultsWinGif.classList.add('results__win-gif');

    const resultHeader = document.createElement('h2');
    resultHeader.textContent = translations[lang].vicResultHeader;

    const resultText = document.createElement('p');
    resultText.textContent = `${translations[lang].vicResultText} ${score} / ${filmsData.length * 5}`;

    const resultWinText = document.createElement('p');
    resultWinText.textContent = `${score} / ${filmsData.length * 5} ${translations[lang].vicWinText}`;

    const restartBtn = document.createElement('button');
    restartBtn.classList.add('button', 'restart-button');
    restartBtn.textContent = translations[lang].vicResultBtn;
    restartBtn.addEventListener('click', () => {location.reload()});

    if (score === filmsData.length * 5) {
        resultContainer.append(resultsWinGif, resultWinText, restartBtn);
    } else {
        resultContainer.append(resultHeader, resultText, restartBtn);
    }
    
    resultPage.append(resultContainer);
    page.append(resultPage);

}

/* --event-listeners------------------------------------------------------------------- */

window.addEventListener('load', () => {
    lang = getLocalStorage(lang);
    
    translate(lang);
    setLangStyle(lang);
    setTimeout(removePreloader, 1500);
});
window.addEventListener('beforeunload', () => setLocalStorage(lang));