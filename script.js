document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const resultContainer = document.getElementById('result-container');
    const resultHeader = document.getElementById('result-header');
    const resultMessage = document.getElementById('result-message');
    const timer = document.getElementById('timer');
    let currentQuestionIndex = 0;
    let score = 0;
    let answerSelected = false;
    const BASE_TIME_LIMIT = 20; // Her soru için varsayılan zaman sınırı
    let timeLeft = BASE_TIME_LIMIT;
    let countdown;

    const questions = [
        {
            question: 'Bir maddenin katıdan sıvıya geçmesi hangi hal değişimidir?',
            options: ['A) Erime', 'B) Kırağılaşma', 'C) Donma', 'D) Yoğuşma'],
            correct: 0
        },
        {
            question: 'Hangisi "Çizgili Kas Hücrelerinden" birinin özelliği değildir?',
            options: ['A) Yorgunluktan sonra iyileşirler', 'B) İsteyerek kontrol edilebilirler', 'C) Çok çekirdekli hücrelerdir', 'D) İç organların çevrelerinde bulunur?'],
            correct: 3
        },
        {
            question: 'Hangisi "Yoğuşma" olayına bir örnektir?',
            options: ['A) Suyun 0 derecede katı hale geçmesi', 'B) Banyodan çıkınca etrafta su taneciklerinin oluşması', 'C) Naftalinin bir süre sonra yok olması', 'D) Suyu 100 derecede ısıtınca buhar olması'],
            correct: 1
        },
        {
            question: 'Hangisi "YANLIŞTIR?"',
            options: ['A) Bitki fotosentez için ışığa ihtiyaç duymaz', 'B) Bitkiler her zaman solunum yapar', 'C) Basit makinelerde enerjiden kazanç olmaz', 'D) 21 Aralık\'ta güneş ışınları oğlak dönencesine dik gelir'],
            correct: 0
        }]   

    function startTimer() {
        countdown = setInterval(() => {
            updateTimer();
            if (timeLeft === 0) {
                clearInterval(countdown);
                checkAnswer(-1, null); // Zaman dolduğunda cevap kontrolü yap
            }
            timeLeft--;
        }, 1000);
    }

    function updateTimer() {
        timer.innerHTML = `${timeLeft} Saniye Kaldı`;
    }

    function showQuestion() {
        answerSelected = false;
        timeLeft = BASE_TIME_LIMIT;
        timer.style.display = 'block'; // Zamanlayıcıyı göster
        startTimer();
        const question = questions[currentQuestionIndex];
        questionElement.innerHTML = question.question;
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-info', 'btn-lg', 'm-2');
            button.innerHTML = option;
            button.addEventListener('click', function() { checkAnswer(index, this); });
            optionsContainer.appendChild(button);
        });
        resultContainer.style.display = 'none';
    }

    function checkAnswer(selectedIndex, btn) {
        clearInterval(countdown);
        if (answerSelected) return;
        answerSelected = true;

        const correctAnswer = questions[currentQuestionIndex].correct;
        if (selectedIndex === correctAnswer) {
            score++;
            resultHeader.textContent = 'Doğru!';
            resultHeader.classList.add('text-success');
            resultHeader.classList.remove('text-danger');
            btn.classList.remove('btn-info');
            btn.classList.add('btn-success');
        } else {
            resultHeader.textContent = `Yanlış!\nDoğru Cevap: ${questions[currentQuestionIndex].options[correctAnswer].substring(0, questions[currentQuestionIndex].options[correctAnswer].indexOf(")"))}) Şıkkı`;
            resultHeader.classList.add('text-danger');
            resultHeader.classList.remove('text-success');
            btn.classList.remove('btn-info');
            btn.classList.add('btn-danger');
        }
        resultMessage.textContent = `Puanınız: ${score}`;
        resultContainer.style.display = 'block';

        let buttons = optionsContainer.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }

        // Tüm soruları cevapladıktan sonra zamanlayıcıyı gizle
        if (currentQuestionIndex === questions.length - 1) {
            timer.style.display = 'none';
        }
    }

    nextButton.addEventListener('click', () => {
        if (!answerSelected) {
            alert('Lütfen devam etmeden önce bir cevap seçin.');
            return;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    function showResult() {
        questionElement.textContent = 'Quiz Tamamlandı!';
        optionsContainer.innerHTML = '';
        resultHeader.textContent = `Final puanınız: ${score} / ${questions.length}`;


        nextButton.style.display = 'none';

        // Özel puanlama hesaplama
        const averageTimePerQuestion = BASE_TIME_LIMIT / questions.length; // Ortalama her soruya ayrılan süre
        const timeRemaining = timeLeft + BASE_TIME_LIMIT * (questions.length - currentQuestionIndex - 1); // Kalan süre
        const bonusScore = Math.round(timeRemaining*timeRemaining / averageTimePerQuestion); // Bonus puan, zamanlama hızına göre
        score += bonusScore;
        resultMessage.textContent += `\nZamanlama Bonusu: +${bonusScore}`;
    }

    showQuestion();
});
