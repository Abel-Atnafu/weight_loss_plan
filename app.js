// FitTrack Shared Logic

const FitTrack = {
    // Local storage key
    STORAGE_KEY: 'fittrack_data',

    // Initial default data
    initData: {
        user: {
            name: 'Abel',
            email: 'abelatnafu.g@gmail.com',
            startWeight: 90,
            goalWeight: 75,
            unit: 'kg'
        },
        logs: [
            { id: 1, date: '2024-04-24', weight: 82.5, note: 'Morning' },
            { id: 2, date: '2024-04-23', weight: 82.7, note: '' },
            { id: 3, date: '2024-04-22', weight: 83.0, note: 'After workout' },
            { id: 4, date: '2024-04-21', weight: 82.9, note: '' },
            { id: 5, date: '2024-04-20', weight: 83.4, note: '' }
        ]
    },

    // Load data from local storage
    getData() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : this.initData;
    },

    // Save data to local storage
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Add a weight log
    addLog(weight, date, note) {
        const data = this.getData();
        const newLog = {
            id: Date.now(),
            date,
            weight: parseFloat(weight),
            note
        };
        data.logs.unshift(newLog);
        this.saveData(data);
        return newLog;
    },

    // Calculate progress
    getStats() {
        const data = this.getData();
        const current = data.logs.length > 0 ? data.logs[0].weight : data.user.startWeight;
        const totalLost = data.user.startWeight - current;
        const remaining = current - data.user.goalWeight;
        const progressPercent = Math.round((totalLost / (data.user.startWeight - data.user.goalWeight)) * 100);

        return {
            current,
            totalLost: totalLost.toFixed(1),
            remaining: remaining.toFixed(1),
            progressPercent: Math.max(0, Math.min(100, progressPercent))
        };
    }
};

// Initialize if needed
if (!localStorage.getItem(FitTrack.STORAGE_KEY)) {
    FitTrack.saveData(FitTrack.initData);
}
