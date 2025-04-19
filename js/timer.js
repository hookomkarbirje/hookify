
/**
 * Timer functionality module
 */

const timerController = {
    state: {
        isActive: false,
        duration: 0,
        remaining: 0,
        breakDuration: 0,
        totalRounds: 1,
        currentRound: 0,
        completedRounds: 0,
        mode: 'focus',
        isPaused: false,
        task: "",
        hideSeconds: false,
        playSound: true,
        soundType: 'beep',
        autoStart: false,
        showNotifications: true
    },

    timerInterval: null,

    init() {
        this.loadTimerPreferences();
        this.setupEventListeners();
        this.setupModalListeners();
    },

    loadTimerPreferences() {
        const timerSettings = localStorage.getItem('timerSettings');
        if (timerSettings) {
            try {
                const settings = JSON.parse(timerSettings);
                this.state = { ...this.state, ...settings };
            } catch (e) {
                console.error('Error parsing timer settings:', e);
            }
        }
    },

    saveTimerPreferences() {
        const settings = {
            hideSeconds: this.state.hideSeconds,
            playSound: this.state.playSound,
            soundType: this.state.soundType,
            autoStart: this.state.autoStart,
            showNotifications: this.state.showNotifications
        };
        localStorage.setItem('timerSettings', JSON.stringify(settings));
    },

    setupEventListeners() {
        document.getElementById('startTimer').addEventListener('click', () => {
            const focusTime = parseInt(document.getElementById('focusTime').textContent);
            const breakTime = parseInt(document.getElementById('breakTime').textContent);
            const rounds = parseInt(document.getElementById('roundsCount').textContent);
            const task = document.getElementById('timerTask').value;
            
            this.setTimer(focusTime * 60, task, breakTime * 60, rounds);
            document.getElementById('timerModal').classList.add('hidden');
        });

        document.getElementById('pauseTimer').addEventListener('click', () => {
            this.pauseResumeTimer();
        });

        document.getElementById('completeTimer').addEventListener('click', () => {
            this.cancelTimer();
        });

        document.getElementById('restartTimer').addEventListener('click', () => {
            this.resetTimer();
        });

        document.getElementById('addTenMinutes').addEventListener('click', () => {
            this.addMinutesToTimer(10);
        });
    },

    setupModalListeners() {
        const modal = document.getElementById('timerModal');
        const tabBtns = document.querySelectorAll('.tab-btn');
        const breakTimeSection = document.getElementById('breakTimeSection');
        const roundsControl = document.getElementById('roundsControl');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const isPomodoro = btn.dataset.type === 'pomodoro';
                breakTimeSection.style.display = isPomodoro ? 'block' : 'none';
                roundsControl.style.display = isPomodoro ? 'flex' : 'none';
            });
        });

        document.getElementById('incrementRounds').addEventListener('click', () => {
            const roundsCount = document.getElementById('roundsCount');
            const currentRounds = parseInt(roundsCount.textContent);
            if (currentRounds < 10) {
                roundsCount.textContent = currentRounds + 1;
                this.updateRoundsInfo();
            }
        });

        document.getElementById('decrementRounds').addEventListener('click', () => {
            const roundsCount = document.getElementById('roundsCount');
            const currentRounds = parseInt(roundsCount.textContent);
            if (currentRounds > 1) {
                roundsCount.textContent = currentRounds - 1;
                this.updateRoundsInfo();
            }
        });
    },

    updateRoundsInfo() {
        const rounds = parseInt(document.getElementById('roundsCount').textContent);
        const focusTime = parseInt(document.getElementById('focusTime').textContent);
        const breakTime = parseInt(document.getElementById('breakTime').textContent);
        
        const info = `${rounds} × ${focusTime}min Focus + ${rounds} × ${breakTime}min Break`;
        document.querySelector('.rounds-info').textContent = info;
    },

    setTimer(duration, task = "", breakDuration = 0, rounds = 1) {
        this.cancelTimer();
        
        this.state.isActive = true;
        this.state.duration = duration;
        this.state.remaining = duration;
        this.state.breakDuration = breakDuration;
        this.state.totalRounds = rounds;
        this.state.currentRound = 0;
        this.state.completedRounds = 0;
        this.state.mode = 'focus';
        this.state.isPaused = false;
        this.state.task = task;
        
        this.startTimerCountdown();
        this.updateTimerUI();
        
        const roundsLabel = rounds > 1 ? `${rounds} rounds` : '1 round';
        const breakInfo = breakDuration > 0 ? `, ${Math.floor(breakDuration / 60)}min break` : '';
        toast.success(`Timer set for ${Math.floor(duration / 60)}min focus${breakInfo}, ${roundsLabel}`);
    },

    startTimerCountdown() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (this.state.isPaused) return;
            
            const remaining = this.state.remaining - 1;
            
            if (remaining <= 0) {
                if (this.state.playSound) {
                    playTimerSound(this.state.soundType);
                }
                
                if (this.state.showNotifications) {
                    const mode = this.state.mode === 'focus' ? 'Focus' : 'Break';
                    this.showNotification(
                        `${mode} time is up!`,
                        `Your ${mode.toLowerCase()} time has ended.`
                    );
                }
                
                if (this.state.mode === 'focus' && this.state.breakDuration > 0) {
                    this.state.mode = 'break';
                    this.state.remaining = this.state.breakDuration;
                } else if (this.state.mode === 'break') {
                    this.state.completedRounds++;
                    this.state.currentRound++;
                    
                    if (this.state.currentRound >= this.state.totalRounds) {
                        clearInterval(this.timerInterval);
                        this.state.isActive = false;
                        this.state.remaining = 0;
                    } else {
                        this.state.mode = 'focus';
                        this.state.remaining = this.state.duration;
                    }
                } else {
                    clearInterval(this.timerInterval);
                    this.state.isActive = false;
                    this.state.remaining = 0;
                }
            } else {
                this.state.remaining = remaining;
            }
            
            this.updateTimerUI();
        }, 1000);
    },

    updateTimerUI() {
        const timerDisplay = document.getElementById('timerDisplay');
        const timeRemaining = document.querySelector('.time-remaining');
        const progressBar = document.querySelector('.progress-bar');
        const roundIndicators = document.getElementById('roundIndicators');
        const roundInfo = document.getElementById('roundInfo');
        const timerTask = document.getElementById('timerTask');
        const timerTabs = document.getElementById('timerTabs');
        
        if (!this.state.isActive) {
            timerDisplay.classList.add('hidden');
            return;
        }
        
        timerDisplay.classList.remove('hidden');
        
        // Update time display
        const minutes = Math.floor(this.state.remaining / 60);
        const seconds = this.state.remaining % 60;
        const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeRemaining.textContent = timeDisplay;
        
        // Update progress bar
        const totalTime = this.state.mode === 'focus' ? this.state.duration : this.state.breakDuration;
        const progress = ((totalTime - this.state.remaining) / totalTime) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update pause/play button
        const pauseBtn = document.getElementById('pauseTimer');
        pauseBtn.innerHTML = this.state.isPaused ? 
            '<i class="fas fa-play"></i>' : 
            '<i class="fas fa-pause"></i>';
        
        // Show/hide and update timer tabs
        if (this.state.breakDuration > 0) {
            timerTabs.classList.remove('hidden');
            const tabs = timerTabs.querySelectorAll('.mode-tab');
            tabs.forEach(tab => {
                const mode = tab.dataset.mode;
                if (mode === this.state.mode) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        } else {
            timerTabs.classList.add('hidden');
        }
        
        // Update round indicators
        if (this.state.totalRounds > 1) {
            roundIndicators.classList.remove('hidden');
            roundIndicators.innerHTML = '';
            
            for (let i = 0; i < this.state.totalRounds; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'round-indicator';
                if (i < this.state.completedRounds || 
                    (i === this.state.currentRound && this.state.mode === 'break')) {
                    indicator.classList.add('completed');
                }
                roundIndicators.appendChild(indicator);
            }
            
            roundInfo.classList.remove('hidden');
            roundInfo.textContent = `Round ${this.state.currentRound + 1} of ${this.state.totalRounds}`;
        } else {
            roundIndicators.classList.add('hidden');
            roundInfo.classList.add('hidden');
        }
        
        // Update task display
        if (this.state.task) {
            timerTask.classList.remove('hidden');
            timerTask.textContent = this.state.task;
        } else {
            timerTask.classList.add('hidden');
        }
    },

    cancelTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const oldSettings = {
            playSound: this.state.playSound,
            soundType: this.state.soundType,
            hideSeconds: this.state.hideSeconds,
            autoStart: this.state.autoStart,
            showNotifications: this.state.showNotifications
        };
        
        this.state = {
            isActive: false,
            duration: 0,
            remaining: 0,
            breakDuration: 0,
            totalRounds: 1,
            currentRound: 0,
            completedRounds: 0,
            mode: 'focus',
            isPaused: false,
            task: "",
            ...oldSettings
        };
        
        this.updateTimerUI();
        toast.info('Timer canceled');
    },

    resetTimer(mode) {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        if (mode) {
            this.state.mode = mode;
            this.state.remaining = mode === 'focus' ? 
                this.state.duration : this.state.breakDuration;
            this.state.isPaused = false;
            
            this.startTimerCountdown();
            toast.info(`Switched to ${mode} timer`);
        } else if (this.state.duration > 0) {
            this.state.remaining = this.state.duration;
            this.state.mode = 'focus';
            this.state.isPaused = false;
            this.state.currentRound = 0;
            this.state.completedRounds = 0;
            
            this.startTimerCountdown();
            toast.info('Timer reset');
        }
        
        this.updateTimerUI();
    },

    pauseResumeTimer() {
        if (!this.state.isActive) return;
        
        this.state.isPaused = !this.state.isPaused;
        toast.info(this.state.isPaused ? 'Timer paused' : 'Timer resumed');
        
        this.updateTimerUI();
    },

    addMinutesToTimer(minutes) {
        if (!this.state.isActive) return;
        
        this.state.remaining += (minutes * 60);
        this.updateTimerUI();
        
        toast.success(`Added ${minutes} minutes to timer`);
    },

    showNotification(title, body) {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return;
        }
        
        if (Notification.permission === "granted") {
            new Notification(title, { body });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body });
                }
            });
        }
    }
};
