function getSongTime(audio) {
    let hours = Math.floor(+audio / 3600);
    let minutes = Math.floor(+audio / 60) - hours * 60;
    let seconds = Math.round(+audio % 60);

    return (hours === 0) ? `${String(minutes).padStart(2, 0)}:${String(seconds).padStart(2, 0)}` : `${String(hours % 60).padStart(2, 0)}:${String(minutes % 60).padStart(2, 0)}:${String(seconds % 60).padStart(2, 0)}`
}

function setSongProgress(audio, audioTime, audioProgressBar) {
    audioTime.textContent = getSongTime(audio.currentTime);
    audioProgressBar.style.width = `${audio.currentTime / audio.duration * 100}%`;
}

function setVolumeLevel(audio, volumeLevel) {
    volumeLevel.style.width = `${audio.volume * 100}%`
}

function getEndTime(audio, endTime) {
    endTime.textContent = getSongTime(audio.duration);
}

function muteAudio(audio, volumeBtn) {
    if (audio.muted) {
        audio.muted = false;
        volumeBtn.classList.toggle('mute');
    } else {
        audio.muted = true;
        volumeBtn.classList.toggle('mute');
    }
}

function setTimelineBar(el, audio, timelineBar) {
    let timelineWidth = window.getComputedStyle(timelineBar).width;
    let clickTime = el.offsetX / Number(timelineWidth.slice(0, -2)) * audio.duration;

    audio.currentTime = clickTime;
}

function setVolumeBar(el, audio, volumeBar) {
    let volumeBarWidth = window.getComputedStyle(volumeBar).width;
    let clickVolume = el.offsetX / Number(volumeBarWidth.slice(0, -2));

    audio.volume = clickVolume;
}

export {getSongTime, setSongProgress, setVolumeLevel, getEndTime, muteAudio, setTimelineBar, setVolumeBar}