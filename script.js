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
        function checkQuiz() {
            const answers = {
                q1: 'b', // Belief, Truth, and Justification
                q2: 'b',  // Sometimes JTB isn't enough because of lucky coincidences
                q3: 'b', // 基礎主義：知識建立在某些不證自明的基本信念之上。
                q4: 'b', // 可靠主義：形成信念的認知過程是否可靠。
                q5: 'd', // 薛丁格的貓
                q6: 'c'  // 檢查資訊來源並進行交叉參考。
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

    // Display results
    alert(`Quiz Results:\nMultiple Choice: ${score}/${total} correct\n\nThe short answer questions require individual review. Great job completing the course!`);
    
    // Mark course as completed
    currentLesson = totalLessons;
    updateProgress();
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
            <a href="https://hcekgkti.gensparkspace.com/" class="underline ml-2">切換到中文版</a>
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
