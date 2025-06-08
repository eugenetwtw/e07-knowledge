// Progress tracking
let currentLesson = 0;
const totalLessons = 6;

function updateProgress() {
    const progress = (currentLesson / totalLessons) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = 
        currentLesson === 0 ? 'Ready to start your journey!' :
        currentLesson === totalLessons ? 'Course completed! Well done!' :
        `Lesson ${currentLesson} completed - ${Math.round(progress)}% done`;
}

// Intersection Observer for lesson tracking
const lessons = document.querySelectorAll('.lesson-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const lessonIndex = Array.from(lessons).indexOf(entry.target);
            if (lessonIndex >= currentLesson) {
                currentLesson = lessonIndex + 1;
                updateProgress();
            }
        }
    });
}, { threshold: 0.5 });

lessons.forEach(lesson => observer.observe(lesson));

// Quiz functionality

// Final Course Assessment
function checkFinalQuiz() {
    const answers = {
        q1: 'b', // Belief, Truth, and Justification
        q2: 'b',  // Sometimes JTB isn't enough because of lucky coincidences
        q3: 'b', // Foundationalism: Knowledge is built upon certain self-evident basic beliefs.
        q4: 'b', // Reliabilism: Whether the cognitive process forming the belief is reliable.
        q5: 'd', // Schrödinger's Cat
        q6: 'c'  // Check information sources and cross-reference.
    };

    let score = 0;
    let total = Object.keys(answers).length;

    // Check multiple choice questions
    for (let question in answers) {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        const options = document.querySelectorAll(`input[name="${question}"]`);
        
        options.forEach(option => {
            const label = option.closest('label');
            label.classList.remove('correct', 'incorrect');
            
            if (option.value === answers[question]) {
                label.classList.add('correct');
                if (selected && selected.value === answers[question]) {
                    score++;
                }
            } else if (selected && option === selected) {
                label.classList.add('incorrect');
            }
        });
    }

    // Check short answer questions (simple check for non-empty)
    const shortAnswerQuestions = ['q7', 'q8', 'q9', 'q10'];
    let shortAnswerCount = 0;
    let shortAnswerCorrect = 0;
    shortAnswerQuestions.forEach(qName => {
        const textarea = document.querySelector(`textarea[name="${qName}"]`);
        if (textarea) {
            shortAnswerCount++;
            if (textarea.value.trim() !== '') {
                shortAnswerCorrect++;
            }
        }
    });

    alert(`Final Quiz Results:\nMultiple Choice: ${score}/${total} correct\nShort Answer: ${shortAnswerCorrect}/${shortAnswerCount} answered (requires manual review)\n\nGreat job completing the course!`);
    
    // Mark course as completed
    currentLesson = totalLessons;
    updateProgress();
}

// Lesson Quiz functionality
function checkLessonQuiz(lessonNumber) {
    let score = 0;
    let totalMc = 0;
    let totalSa = 0;
    let mcCorrect = 0;
    let saAnswered = 0;

    const lessonAnswers = {
        1: {
            mc: { q1_1: 'b', q1_2: 'b', q1_3: 'b' },
            sa: ['qa1_1', 'qa1_2']
        },
        2: {
            mc: { q2_1: 'd', q2_2: 'c', q2_3: 'b' },
            sa: ['qa2_1', 'qa2_2']
        },
        3: {
            mc: { q3_1: 'b', q3_2: 'c', q3_3: 'b' },
            sa: ['qa3_1', 'qa3_2']
        },
        4: {
            mc: { q4_1: 'c', q4_2: 'b', q4_3: 'c' },
            sa: ['qa4_1', 'qa4_2']
        },
        5: {
            mc: { q5_1: 'b', q5_2: 'b', q5_3: 'b' },
            sa: ['qa5_1', 'qa5_2']
        },
        6: {
            mc: { q6_1: 'b', q6_2: 'b', q6_3: 'c' },
            sa: ['qa6_1', 'qa6_2']
        }
    };

    const currentLessonAnswers = lessonAnswers[lessonNumber];

    // Check multiple choice questions for the specific lesson
    for (const qName in currentLessonAnswers.mc) {
        totalMc++;
        const selected = document.querySelector(`input[name="${qName}"]:checked`);
        const options = document.querySelectorAll(`input[name="${qName}"]`);

        options.forEach(option => {
            const label = option.closest('label');
            label.classList.remove('correct', 'incorrect');
            
            if (option.value === currentLessonAnswers.mc[qName]) {
                label.classList.add('correct');
                if (selected && selected.value === currentLessonAnswers.mc[qName]) {
                    mcCorrect++;
                }
            } else if (selected && option === selected) {
                label.classList.add('incorrect');
            }
        });
    }

    // Check short answer questions for the specific lesson (simple check for non-empty)
    currentLessonAnswers.sa.forEach(qName => {
        totalSa++;
        const textarea = document.querySelector(`textarea[name="${qName}"]`);
        if (textarea && textarea.value.trim() !== '') {
            saAnswered++;
        }
    });

    alert(`Lesson ${lessonNumber} Quiz Results:\nMultiple Choice: ${mcCorrect}/${totalMc} correct\nShort Answer: ${saAnswered}/${totalSa} answered (requires manual review)`);
}

// Smooth scrolling for navigation
function scrollToLesson(lessonNumber) {
    const lesson = lessons[lessonNumber - 1];
    if (lesson) {
        lesson.scrollIntoView({ behavior: 'smooth' });
    }
}

// Language detection and switching
function detectLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith('zh')) {
        // Show suggestion to switch to Chinese
        const banner = document.createElement('div');
        banner.className = 'bg-blue-600 text-white text-center py-2 px-4';
        banner.innerHTML = `
            <span>中文用戶？</span>
            <a href="https://e07-knowledge.vercel.app/index_zh.html" class="underline ml-2">切換到中文版</a>
            <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">✕</button>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    detectLanguage();
});
