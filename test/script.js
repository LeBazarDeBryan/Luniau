function loadMusicFiles() {
    fetch('music.json')
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('file-list');
            const audioPlayer = new Audio();
            const searchBox = document.getElementById('search-box');
            const lyricsBtn = document.getElementById('lyrics-btn');
            const infoBtn = document.getElementById('info-btn');
            const playBtn = document.getElementById('play-btn');
            const pauseBtn = document.getElementById('pause-btn');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const progressBar = document.getElementById('progress-bar');
            const progressContainer = document.getElementById('progress-container');
            const currentTime = document.getElementById('current-time');
            const duration = document.getElementById('duration');

            let currentTrackIndex = 0;
            let tracks = [];

            function renderFiles(filteredFiles) {
                fileList.innerHTML = '';
                filteredFiles.forEach((file, index) => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = file.name;

                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        playTrack(index);

                        lyricsBtn.dataset.lyrics = file.lyrics || 'No lyrics available.';
                        infoBtn.dataset.cover = file.cover || '';
                        infoBtn.dataset.date = file.date || 'Unknown';
                        infoBtn.dataset.additionalInfo = file.additionalInfo || 'No additional information available.';
                    });

                    listItem.appendChild(link);
                    fileList.appendChild(listItem);
                });

                tracks = filteredFiles;
            }

            function filterFiles() {
                const query = searchBox.value.toLowerCase();
                const filteredFiles = files.filter(file => file.name.toLowerCase().includes(query));
                renderFiles(filteredFiles);
            }

            function playTrack(index) {
                if (index >= 0 && index < tracks.length) {
                    const track = tracks[index];
                    audioPlayer.src = track.path;
                    currentTime.textContent = '00:00';
                    duration.textContent = '00:00';
                    audioPlayer.play()
                        .catch(error => console.error('Error playing the audio file:', error));
                    currentTrackIndex = index;
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'inline';
                }
            }

            function updateProgress() {
                if (!isNaN(audioPlayer.duration)) {
                    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                    progressBar.style.width = `${progress}%`;
                    currentTime.textContent = formatTime(audioPlayer.currentTime);
                    duration.textContent = formatTime(audioPlayer.duration);
                }
            }

            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }

            function togglePlayPause() {
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'inline';
                } else {
                    audioPlayer.pause();
                    playBtn.style.display = 'inline';
                    pauseBtn.style.display = 'none';
                }
            }

            function nextTrack() {
                if (currentTrackIndex < tracks.length - 1) {
                    playTrack(currentTrackIndex + 1);
                }
            }

            function prevTrack() {
                if (currentTrackIndex > 0) {
                    playTrack(currentTrackIndex - 1);
                }
            }

            audioPlayer.addEventListener('timeupdate', updateProgress);
            audioPlayer.addEventListener('ended', nextTrack);
            audioPlayer.addEventListener('loadedmetadata', () => {
                currentTime.textContent = formatTime(audioPlayer.currentTime);
                duration.textContent = formatTime(audioPlayer.duration);
            });

            playBtn.addEventListener('click', togglePlayPause);
            pauseBtn.addEventListener('click', togglePlayPause);
            nextBtn.addEventListener('click', nextTrack);
            prevBtn.addEventListener('click', prevTrack);

            progressContainer.addEventListener('click', (event) => {
                const rect = progressContainer.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const progressPercent = offsetX / rect.width;
                audioPlayer.currentTime = progressPercent * audioPlayer.duration;
            });

            searchBox.addEventListener('input', filterFiles);

            renderFiles(files);
        })
        .catch(error => console.error('Error loading file list:', error));
}

function fetchFileContent(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('File not found');
            }
            return response.text();
        })
        .catch(() => 'Not found.');
}

document.addEventListener('DOMContentLoaded', loadMusicFiles);

const panel = document.querySelector('.panel-right');
const toggleBtn = document.querySelector('.toggle-panel-btn');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalCover = document.getElementById('modal-cover');
const settingsPanel = document.getElementById('settings-panel');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.querySelector('#settings-panel .close');
const rgbCycleToggle = document.getElementById('partyMode');
const banner = document.getElementById('banner');
const searchbox = document.getElementById('search-box');
const progressContainer = document.getElementById('progress-container');

const elementsWithShadow = [
    settingsPanel,
    panel,
    document.querySelector('.audio-container'),
    toggleBtn,
    banner,
    searchbox,
    progressContainer,
	modal
];

let rgbCycleInterval;

function startRgbCycle() {
    let hue = 0;
    rgbCycleInterval = setInterval(() => {
        hue = (hue + 1) % 360;
        const shadowColor = `hsl(${hue}, 100%, 50%)`;

        elementsWithShadow.forEach(element => {
            element.style.boxShadow = `-2px 0 10px ${shadowColor}`;
        });
    }, 30);
}

function stopRgbCycle() {
    clearInterval(rgbCycleInterval);
    elementsWithShadow.forEach(element => {
        element.style.boxShadow = `-2px 0 10px rgba(255, 255, 255, 0.5)`;
    });
}

rgbCycleToggle.addEventListener('change', () => {
    if (rgbCycleToggle.checked) {
        startRgbCycle();
    } else {
        stopRgbCycle();
    }
});

toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('hidden');
});

settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('show');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.remove('show');
});

function openModal(title, content, imageSrc = '') {
    modalTitle.textContent = title;
    modalContent.innerHTML = content.replace(/\n/g, '<br>');
    modalCover.src = imageSrc;
    modalCover.style.display = imageSrc ? 'block' : 'none';
    modal.style.display = 'block';
}

function closeModalHandler() {
    modal.style.display = 'none';
}

document.getElementById('info-btn').addEventListener('click', () => {
    const cover = document.getElementById('info-btn').dataset.cover;
    const datePath = document.getElementById('info-btn').dataset.date;
    const additionalInfoPath = document.getElementById('info-btn').dataset.additionalInfo;

    Promise.all([fetchFileContent(datePath), fetchFileContent(additionalInfoPath)])
        .then(([dateContent, additionalInfoContent]) => {
            openModal('Info', `Date: ${dateContent}<br /><br />Additional Information: ${additionalInfoContent}`, cover);
        });
});

document.getElementById('lyrics-btn').addEventListener('click', () => {
    const lyricsPath = document.getElementById('lyrics-btn').dataset.lyrics;
    fetchFileContent(lyricsPath)
        .then(lyricsContent => openModal('Lyrics', lyricsContent));
});

document.getElementById('about-btn').addEventListener('click', () => openModal('About Luniau', '2024-present<br /><br />Luniau is a streaming "platform" that streams high-quality audio (1411-1536 Kbit/s). There is no ads, no trackers, no cookies. I try my best for privacy and quality. You can make a song request <a href="https://github.com/LeBazarDeBryan/Luniau/issues/new?assignees=&labels=&projects=&template=song-request.md&title=%5BREQUEST%5D+Author+-+Name">here</a>. It helps me to extend the library.<br /><br />Format<br />The date format is DD/MM/YYYY, and for the music, I use <a href="https://en.wikipedia.org/wiki/WAV">WAV</a>.'));

closeModal.addEventListener('click', closeModalHandler);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModalHandler();
    }
});