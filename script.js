    function loadMusicFiles() {
        fetch('music.json')
            .then(response => response.json())
            .then(files => {
                const fileList = document.getElementById('file-list');
                const audioPlayer = document.getElementById('audio-player');
                const searchBox = document.getElementById('search-box');
                const lyricsBtn = document.getElementById('lyrics-btn');
                const infoBtn = document.getElementById('info-btn');

                function renderFiles(filteredFiles) {
                    fileList.innerHTML = '';
                    filteredFiles.forEach(file => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = '#';
                        link.textContent = file.name;

                        const audio = new Audio(file.path);
                        audio.preload = 'auto';

                        link.addEventListener('click', (event) => {
                            event.preventDefault();
                            audioPlayer.src = file.path;
                            audioPlayer.play()
                                .catch(error => console.error('Error playing the audio file:', error));

                            lyricsBtn.dataset.lyrics = file.lyrics || 'No lyrics available.';
                            infoBtn.dataset.cover = file.cover || '';
                            infoBtn.dataset.date = file.date || 'Unknown';
                            infoBtn.dataset.additionalInfo = file.additionalInfo || 'No additional information available.';
                        });

                        listItem.appendChild(link);
                        fileList.appendChild(listItem);
                    });
                }

                function filterFiles() {
                    const query = searchBox.value.toLowerCase();
                    const filteredFiles = files.filter(file => file.name.toLowerCase().includes(query));
                    renderFiles(filteredFiles);
                }

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
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalCover = document.getElementById('modal-cover');

    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('hidden');
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

    document.getElementById('about-btn').addEventListener('click', () => openModal('About Luniau', '2024-present<br /><br />Luniau is a streaming "platform" that stream high-quality audio (1411-1536 Kbit/s). Theres no ads, no trackers, no cookies. I try my best for privacy and quality. You can make a song request <a href="https://github.com/LeBazarDeBryan/Luniau/issues/new?assignees=&labels=&projects=&template=song-request.md&title=%5BREQUEST%5D+Author+-+Name">here</a>. It helps me to extend the library.<br /><br />Format<br />The date format is DD/MM/YYYY. The music format is <a href="https://en.wikipedia.org/wiki/WAV">WAV</a>.'));

    closeModal.addEventListener('click', closeModalHandler);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModalHandler();
        }
    });