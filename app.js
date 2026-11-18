// Sidebar Toggle Logic
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function openMenu() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeMenu() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

menuBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// Dark Mode Logic (with LocalStorage)
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Update Question Counts on Home Page
function updateCounts() {
    document.getElementById('count-hindi').innerText = `${hindiMCQs.length} प्रश्न`;
    document.getElementById('count-english').innerText = `${englishMCQs.length} प्रश्न`;
    document.getElementById('count-evs').innerText = `${evsMCQs.length} प्रश्न`;
    document.getElementById('count-cdp').innerText = `${cdpMCQs.length} प्रश्न`;
    document.getElementById('count-reasoning').innerText = `${reasoningMCQs.length} प्रश्न`;
    document.getElementById('count-maths').innerText = `${mathsMCQs.length} प्रश्न`;
}
window.onload = updateCounts;

// Navigation Functions
function showHome() {
    document.getElementById('home-section').classList.remove('hidden');
    document.getElementById('quiz-section').classList.add('hidden');
    closeMenu();
    window.scrollTo(0, 0);
}

let currentQuestions = [];

function loadChapter(chapterKey, chapterTitle) {
    const dataMap = {
        'hindi': hindiMCQs,
        'english': englishMCQs,
        'evs': evsMCQs,
        'cdp': cdpMCQs,
        'reasoning': reasoningMCQs,
        'maths': mathsMCQs
    };

    currentQuestions = dataMap[chapterKey] || [];
    document.getElementById('quiz-title').innerText = `${chapterTitle} (${currentQuestions.length} प्रश्न)`;
    renderQuestions(currentQuestions);
    
    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');
    closeMenu();
    window.scrollTo(0, 0);
}

// Practice Set Generator (50 Random MCQs from all chapters)
function startPracticeSet() {
    const allMCQs = [
        ...hindiMCQs,
        ...englishMCQs,
        ...evsMCQs,
        ...cdpMCQs,
        ...reasoningMCQs,
        ...mathsMCQs
    ];

    if (allMCQs.length === 0) {
        alert("अभी किसी भी अध्याय में प्रश्न उपलब्ध नहीं हैं। कृपया पहले प्रश्न जोड़ें।");
        return;
    }

    // Fisher-Yates Shuffle
    const shuffled = [...allMCQs];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select up to 50 questions
    currentQuestions = shuffled.slice(0, 50);
    document.getElementById('quiz-title').innerText = `प्रैक्टिस सेट (${currentQuestions.length} रैंडम प्रश्न)`;
    renderQuestions(currentQuestions);

    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');
    closeMenu();
    window.scrollTo(0, 0);
}

// Render Questions to DOM
function renderQuestions(questions) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    if (questions.length === 0) {
        container.innerHTML = `<div class="question-card"><p>इस अध्याय में अभी प्रश्न जोड़े जाने बाकी हैं।</p></div>`;
        return;
    }

    questions.forEach((item, index) => {
        const qNum = index + 1;
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `q-${qNum}`;

        let optionsHTML = '';
        item.options.forEach((opt, optIdx) => {
            optionsHTML += `<div class="option-item" onclick="checkOption(this, ${optIdx}, ${item.answer})">${opt}</div>`;
        });

        card.innerHTML = `
            <div class="q-text">प्रश्न ${qNum}. ${item.question}</div>
            <div class="options-list">${optionsHTML}</div>
            <button class="ans-toggle-btn" onclick="toggleAnswer(${qNum})">उत्तर देखें / छुपाएं</button>
            <div id="ans-${qNum}" class="ans-box">सही उत्तर: ${item.options[item.answer]}</div>
        `;
        container.appendChild(card);
    });
}

// Interactive Option Check
function checkOption(el, selectedIdx, correctIdx) {
    const parent = el.parentElement;
    if (parent.classList.contains('answered')) return;
    parent.classList.add('answered');

    if (selectedIdx === correctIdx) {
        el.classList.add('correct');
    } else {
        el.classList.add('wrong');
        parent.children[correctIdx].classList.add('correct');
    }
}

// Show/Hide Answer Box
function toggleAnswer(qNum) {
    const ansBox = document.getElementById(`ans-${qNum}`);
    ansBox.classList.toggle('show');
}

// Go To Particular Question
function goToQuestion() {
    const num = parseInt(document.getElementById('goto-input').value);
    if (!num || num < 1 || num > currentQuestions.length) {
        alert(`कृपया 1 से ${currentQuestions.length} के बीच सही प्रश्न संख्या दर्ज करें।`);
        return;
    }
    const target = document.getElementById(`q-${num}`);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        target.style.borderColor = '#2563eb';
        setTimeout(() => target.style.borderColor = '', 2000);
    }
}
