// FitTrack - Real Database Integration (Supabase)
// You will need to replace these with your own Supabase URL and Key
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

// Initialize Supabase Client (if keys are provided)
let supabase = null;
if (SUPABASE_URL !== 'https://your-project.supabase.co') {
    supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

const FitTrack = {
    // Streak Logic
    calculateStreak(logs) {
        if (!logs || logs.length === 0) return 0;
        
        // Sort logs by date descending
        const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Check if the most recent log is today or yesterday
        const lastLogDate = new Date(sortedLogs[0].date);
        lastLogDate.setHours(0, 0, 0, 0);
        
        const diffInTime = currentDate.getTime() - lastLogDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        if (diffInDays > 1) return 0; // Streak broken

        let checkDate = lastLogDate;
        for (let i = 0; i < sortedLogs.length; i++) {
            const logDate = new Date(sortedLogs[i].date);
            logDate.setHours(0, 0, 0, 0);

            if (logDate.getTime() === checkDate.getTime()) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (logDate.getTime() < checkDate.getTime()) {
                break; // Missing a day
            }
        }
        return streak;
    },

    // Mock functions for now (will be replaced by Supabase calls)
    async getLogs() {
        // This will eventually be: const { data } = await supabase.from('logs').select('*').order('date', { ascending: false });
        const saved = localStorage.getItem('fittrack_logs');
        return saved ? JSON.parse(saved) : [];
    },

    async saveLog(weight, date, note) {
        const logs = await this.getLogs();
        const newLog = { id: Date.now(), weight: parseFloat(weight), date, note };
        logs.unshift(newLog);
        localStorage.setItem('fittrack_logs', JSON.stringify(logs));
        return newLog;
    }
};

// --- Extreme UI Interactions ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorOutline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        
        // Ambient Light Tracker
        const ambient = document.querySelector('.ambient-light');
        if(ambient) {
            ambient.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
    });

    // Cursor hover effects on interactive elements
    const interactives = document.querySelectorAll('a, button, input, .interactive-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
    });

    // 2. 3D Card Tilt Effect
    const cards = document.querySelectorAll('.interactive-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // 3. Number Counter Animation
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    window.FitTrackUI = { animateValue };
});
