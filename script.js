/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
    let currentWordIndex = 0;
    const wordsToType = [];
    let timerInterval = null;
    let totalCorrectChars = 0;
    let totalTypedChars = 0;

    // DOM Elements
    const modeSelect = document.getElementById("mode");
    const wordDisplay = document.getElementById("word-display");
    const inputField = document.getElementById("input-field");
    const restartBtn = document.getElementById("restart-btn");
    const wpmDisplay = document.getElementById("wpm");
    const accuracyDisplay = document.getElementById("accuracy");
    const scoreDisplay = document.getElementById("score");
    const wordCountDisplay = document.getElementById("word-count");
    const totalWordsDisplay = document.getElementById("total-words");
    const timerDisplay = document.getElementById("timer");
    const progressBar = document.getElementById("progress-bar");

    // Word lists
    const words = {
        easy: ["apple", "banana", "grape", "orange", "cherry", "peach", "melon", "kiwi", "mango", "pear", 
              "lemon", "berry", "date", "fig", "lime", "pear", "plum", "kiwi", "guava", "melon"],
        medium: ["keyboard", "monitor", "printer", "charger", "battery", "laptop", "mouse", "screen", 
                "speaker", "cable", "router", "server", "tablet", "mobile", "device", "display", 
                "adapter", "memory", "storage", "webcam"],
        hard: ["synchronize", "complicated", "development", "extravagant", "misconception", 
              "phenomenon", "quintessential", "rehabilitation", "unprecedented", "xylophone",
              "asymmetrical", "bureaucracy", "cryptography", "discombobulate", "extraterrestrial",
              "flabbergasted", "grandiloquent", "hippopotamus", "idiosyncratic", "juxtaposition"]
    };

    // Generate a random word from the selected mode
    const getRandomWord = (mode) => {
        const wordList = words[mode];
        return wordList[Math.floor(Math.random() * wordList.length)];
    };

    // Start or restart the timer
    const startTimer = () => {
        if (!startTime) {
            startTime = Date.now();
            previousEndTime = startTime;
            
            // Update timer display every second
            timerInterval = setInterval(() => {
                if (startTime) {
                    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                    timerDisplay.textContent = elapsedSeconds;
                }
            }, 1000);
        }
    };

    // Calculate and return WPM & accuracy
    const getCurrentStats = () => {
        if (!previousEndTime) return { wpm: 0, accuracy: 0 };
        
        const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
        const wpm = elapsedTime > 0 ? (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60) : 0;
        const accuracy = totalTypedChars > 0 ? (totalCorrectChars / totalTypedChars) * 100 : 0;
        
        return { 
            wpm: Math.max(0, wpm.toFixed(2)), 
            accuracy: Math.max(0, Math.min(100, accuracy.toFixed(2))) 
        };
    };

    // Calculate score based on WPM and accuracy
    const calculateScore = (wpm, accuracy) => {
        return Math.round(wpm * (accuracy / 100));
    };

    // Update progress bar
    const updateProgress = () => {
        const progress = (currentWordIndex / wordsToType.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Change progress bar color based on progress
        if (progress > 75) {
            progressBar.className = "progress-bar bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full";
        } else if (progress > 50) {
            progressBar.className = "progress-bar bg-gradient-to-r from-green-400 to-lime-500 h-3 rounded-full";
        } else if (progress > 25) {
            progressBar.className = "progress-bar bg-gradient-to-r from-lime-400 to-green-500 h-3 rounded-full";
        }
    };

    // Initialize the typing test
    const startTest = (wordCount = 50) => {
        // Reset all variables
        clearInterval(timerInterval);
        wordsToType.length = 0;
        wordDisplay.innerHTML = "";
        currentWordIndex = 0;
        startTime = null;
        previousEndTime = null;
        totalCorrectChars = 0;
        totalTypedChars = 0;
        
        // Reset displays
        wpmDisplay.textContent = "0";
        accuracyDisplay.textContent = "0";
        scoreDisplay.textContent = "0";
        wordCountDisplay.textContent = "0";
        totalWordsDisplay.textContent = wordCount;
        timerDisplay.textContent = "0";
        progressBar.style.width = "0%";
        progressBar.className = "progress-bar bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full";
        
        // Generate words
        for (let i = 0; i < wordCount; i++) {
            wordsToType.push(getRandomWord(modeSelect.value));
        }
        
        // Display words
        wordsToType.forEach((word, index) => {
            const span = document.createElement("span");
            span.textContent = word + " ";
            if (index === 0) {
                span.className = "text-emerald-600 font-bold";
            }
            wordDisplay.appendChild(span);
        });
        
        inputField.value = "";
        inputField.focus();
        
        // Add animation to input field
        inputField.classList.add("glow");
        setTimeout(() => {
            inputField.classList.remove("glow");
        }, 2000);
    };

    // Move to the next word and update stats only on spacebar press
    const updateWord = (event) => {
        if (event.key === " ") {
            event.preventDefault();
            
            const currentWord = wordsToType[currentWordIndex];
            const typedWord = inputField.value.trim();
            
            // Update character counts for accuracy calculation
            totalTypedChars += typedWord.length;
            for (let i = 0; i < Math.min(typedWord.length, currentWord.length); i++) {
                if (typedWord[i] === currentWord[i]) {
                    totalCorrectChars++;
                }
            }
            
            if (typedWord === currentWord) {
                if (!previousEndTime) previousEndTime = startTime;
                
                const { wpm, accuracy } = getCurrentStats();
                const score = calculateScore(wpm, accuracy);
                
                // Update displays with animation
                wpmDisplay.textContent = wpm;
                accuracyDisplay.textContent = accuracy;
                scoreDisplay.textContent = score;
                wordCountDisplay.textContent = currentWordIndex + 1;
                
                // Add celebration effect for every 10 words
                if ((currentWordIndex + 1) % 10 === 0) {
                    wordDisplay.classList.add("animate-pulse");
                    setTimeout(() => {
                        wordDisplay.classList.remove("animate-pulse");
                    }, 500);
                }
                
                // Move to next word
                currentWordIndex++;
                previousEndTime = Date.now();
                highlightNextWord();
                updateProgress();
                
                inputField.value = "";
                
                // Test complete
                if (currentWordIndex >= wordsToType.length) {
                    clearInterval(timerInterval);
                    inputField.blur();
                    
                    // Show completion effect
                    wordDisplay.innerHTML = `
                        <div class="text-center py-10">
                            <i class="fas fa-trophy text-5xl text-yellow-400 mb-4"></i>
                            <h3 class="text-2xl font-bold text-emerald-600">Test Completed!</h3>
                            <p class="text-gray-600 mt-2">Final Score: ${score}</p>
                        </div>
                    `;
                }
            }
        }
    };

    // Highlight the current word in green
    const highlightNextWord = () => {
        const wordElements = wordDisplay.children;
        
        if (currentWordIndex < wordElements.length) {
            // Reset previous word
            if (currentWordIndex > 0) {
                wordElements[currentWordIndex - 1].className = "";
            }
            
            // Highlight current word with animation
            wordElements[currentWordIndex].className = "text-emerald-600 font-bold animate-bounce";
            setTimeout(() => {
                wordElements[currentWordIndex].className = "text-emerald-600 font-bold";
            }, 1000);
            
            // Scroll to current word if needed
            wordElements[currentWordIndex].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    };

    // Event listeners
    inputField.addEventListener("keydown", (event) => {
        startTimer();
        updateWord(event);
    });
    
    modeSelect.addEventListener("change", () => {
        startTest();
        // Add visual feedback
        modeSelect.classList.add("ring-2", "ring-emerald-300");
        setTimeout(() => {
            modeSelect.classList.remove("ring-2", "ring-emerald-300");
        }, 1000);
    });
    
    restartBtn.addEventListener("click", () => {
        startTest();
        // Add visual feedback
        restartBtn.classList.add("animate-spin");
        setTimeout(() => {
            restartBtn.classList.remove("animate-spin");
        }, 500);
    });
    
    // Start the test
    startTest();