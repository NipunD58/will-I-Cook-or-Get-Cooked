document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fate-form');
    const resultContainer = document.getElementById('result-container');
    const resetBtn = document.getElementById('reset-btn');
    const glassCard = document.querySelector('.glass-card');
    const faahOverlay = document.getElementById('faah-overlay');

    // Loud sound effect
    const faahSound = new Audio('FAAAH.mp3');

    // Set minimum date to today
    const dateInput = document.getElementById('exam-time');
    const nowInit = new Date();
    nowInit.setMinutes(nowInit.getMinutes() - nowInit.getTimezoneOffset());
    dateInput.min = nowInit.toISOString().slice(0, 16);

    // Real-time clock updater
    const clockEl = document.getElementById('realtime-clock');
    function updateClock() {
        if (!clockEl) return;
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        clockEl.textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const subject = document.getElementById('subject').value;
        const totalChapters = parseInt(document.getElementById('total-chapters').value);
        const completedChapters = parseInt(document.getElementById('completed-chapters').value);
        const examTime = new Date(document.getElementById('exam-time').value);
        const examWeight = parseInt(document.getElementById('exam-weight').value) || 5;
        const sleepSacrifice = parseFloat(document.getElementById('sleep-sacrifice').value) || 0;
        const currentTime = new Date();

        // Validation
        if (completedChapters > totalChapters) {
            alert("You can't complete more chapters than there are in the exam!");
            return;
        }

        const timeDiffMs = examTime - currentTime;

        if (timeDiffMs <= 0) {
            alert("The exam has already started or passed! You're definitely cooked.");
            return;
        }

        // Calculations
        const chaptersLeft = totalChapters - completedChapters;
        const realHoursLeft = timeDiffMs / (1000 * 60 * 60);

        // Subtract sleep time from available hours. Default sleep is 8.
        const actualSleep = Math.max(0, 8 - sleepSacrifice);
        const hoursLeft = realHoursLeft * ((24 - actualSleep) / 24);

        let status = '';
        let title = '';
        let message = '';
        let gifUrl = '';
        let pace = 0;

        if (chaptersLeft === 0) {
            status = 'cook';
            title = 'You are COOKING!';
        message = `You've already finished all chapters for ${subject}. Just revise and chill, easy dub!`;
        gifUrl = 'https://giphy.com/embed/13HgwGsXF0aiGY'; // Chill dog
        pace = 0;
    } else {
        pace = hoursLeft / chaptersLeft;

        // Adjust effective pace based on difficulty weight
        // Weight 5 = normal (multiplier 1). Weight 10 = twice as hard (multiplier 2)
        const weightMultiplier = examWeight / 5;
        const effectivePace = pace / weightMultiplier;

        if(effectivePace < 1) {
            // Effective pace < 1 hour per chapter
            status = 'cooked';
            title = 'Absolutely COOKED.';
            message = `For ${subject} (Difficulty: ${examWeight}/10), you only have ${pace.toFixed(2)} real hours per chapter. Start praying and lock in IMMEDIATELY.`;
            gifUrl = 'https://giphy.com/embed/5h57daS09IInn3TB14'; // Elmo fire
        } else if(effectivePace >= 1 && effectivePace < 3) {
        // 1 to 3 hours per chapter effective
        status = 'warning';
        title = 'Lightly Toasted';
        message = `It's gonna be tight for ${subject} (Difficulty: ${examWeight}/10). ${pace.toFixed(1)} hours per chapter is doable but you need zero distractions right now.`;
        gifUrl = 'https://giphy.com/embed/l4FATJpd4LWgeruTK'; // Sweating Jordan Peele
    } else {
        // 3+ hours per chapter effective
        status = 'cook';
        title = 'You will COOK!';
        message = `Plenty of time for ${subject}! You have ${pace.toFixed(1)} hours per chapter. Stay consistent and you'll ace it.`;
        gifUrl = 'https://giphy.com/embed/demgpwJ6rs2DS'; // Chef cooking
    }
}

        // Update UI
        document.getElementById('result-title').textContent = title;
document.getElementById('result-title').className = `text-${status}`;
document.getElementById('result-gif').src = gifUrl;
document.getElementById('result-message').textContent = message;

document.getElementById('stat-time-left').textContent = hoursLeft > 99 ? '99+' : hoursLeft.toFixed(1);
document.getElementById('stat-chapters-left').textContent = chaptersLeft;
document.getElementById('stat-pace').textContent = chaptersLeft === 0 ? 'N/A' : pace.toFixed(1);

// Update visual theme
glassCard.setAttribute('data-status', status);

// Transition
form.classList.add('hidden');
form.style.display = 'none';

resultContainer.classList.remove('hidden');

// FAAAH Animation Trigger
if (status === 'cooked') {
    faahOverlay.classList.remove('hidden');
    faahSound.volume = 1.0; // Max volume
    faahSound.currentTime = 0;
    faahSound.play().catch(e => console.log('Audio autoplay blocked by browser'));

    // Hide the overlay after 1.5 seconds
    setTimeout(() => {
        faahOverlay.classList.add('hidden');
    }, 1500);
}
    });

resetBtn.addEventListener('click', () => {
    resultContainer.classList.add('hidden');
    setTimeout(() => {
        form.style.display = 'flex';
        form.classList.remove('hidden');
        glassCard.removeAttribute('data-status');
        // reset form but keep subject and dates maybe? Or just full reset
        // form.reset(); 
    }, 300);
});
});
