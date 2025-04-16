
class SoundscapesPlayer {
    constructor() {
        this.sounds = [
            { id: 'rain', name: 'Rain', file: 'rain.mp3' },
            { id: 'forest', name: 'Forest', file: 'forest.mp3' },
            { id: 'ocean', name: 'Ocean', file: 'ocean.mp3' },
            { id: 'coffee', name: 'Cafe', file: 'cafe.mp3' }
        ];
        this.activeSounds = [];
        this.isPlaying = false;
        this.timer = null;
        
        this.initializeUI();
        this.bindEvents();
    }

    initializeUI() {
        const soundGrid = document.querySelector('.sound-grid');
        this.sounds.forEach(sound => {
            const soundIcon = document.createElement('div');
            soundIcon.classList.add('sound-icon');
            soundIcon.innerHTML = `<span>${sound.name}</span>`;
            soundIcon.dataset.soundId = sound.id;
            soundGrid.appendChild(soundIcon);
        });
    }

    bindEvents() {
        const soundIcons = document.querySelectorAll('.sound-icon');
        soundIcons.forEach(icon => {
            icon.addEventListener('click', () => this.toggleSound(icon.dataset.soundId));
        });

        document.getElementById('play-pause').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('timer').addEventListener('click', () => this.showTimerModal());
        
        document.getElementById('start-timer').addEventListener('click', () => this.startTimer());
        document.getElementById('cancel-timer').addEventListener('click', () => this.cancelTimer());
    }

    toggleSound(soundId) {
        const soundIcon = document.querySelector(`[data-sound-id="${soundId}"]`);
        soundIcon.classList.toggle('active');
        
        const sound = this.sounds.find(s => s.id === soundId);
        const audioElement = document.getElementById(soundId);

        if (!audioElement) {
            const audio = new Audio(sound.file);
            audio.id = soundId;
            audio.loop = true;
            document.body.appendChild(audio);
            this.activeSounds.push(audio);
            audio.play();
        } else {
            this.activeSounds = this.activeSounds.filter(a => a.id !== soundId);
            audioElement.pause();
            audioElement.remove();
        }
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.activeSounds.forEach(sound => {
            this.isPlaying ? sound.play() : sound.pause();
        });
    }

    showTimerModal() {
        document.getElementById('timer-modal').style.display = 'flex';
    }

    startTimer() {
        const duration = document.getElementById('timer-duration').value;
        if (duration) {
            let seconds = duration * 60;
            document.getElementById('timer-modal').style.display = 'none';
            
            this.timer = setInterval(() => {
                seconds--;
                if (seconds <= 0) {
                    this.cancelTimer();
                    alert('Timer completed!');
                }
            }, 1000);
        }
    }

    cancelTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SoundscapesPlayer();
});
