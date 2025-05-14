document.addEventListener('DOMContentLoaded', function() {
    const startScreen = document.getElementById('start-screen');
    const playButton = document.getElementById('play-button');
    const rulesContainer = document.getElementById('rules-container');
    const closeRules = document.getElementById('close-rules');
    const startGameButton = document.getElementById('start-game');
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    const gameOverContainer = document.getElementById('game-over-container');
    const gameOverMessage = document.getElementById('game-over-message');
    const gameOverStats = document.getElementById('game-over-stats');
    const restartButton = document.getElementById('restart-button');
    
    // Spielvariablen
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let timer;
    let timeLeft = 120;
    let pairsFound = 0;
    let totalFlips = 0;
    
    // Emoji für die Karten
    const emojis = ["🐱", "🐶", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯"];
    
    // Play Button Klick
    playButton.addEventListener('click', function() {
        playButton.style.transform = "scale(1.2) rotate(360deg)";
        setTimeout(() => {
            startScreen.style.transform = "translateY(-100%)";
            rulesContainer.style.display = "block";
        }, 500);
    });
    
    // Regeln schließen
    closeRules.addEventListener('click', function() {
        rulesContainer.style.display = "none";
    });
    
    // Spiel starten
    startGameButton.addEventListener('click', function() {
        rulesContainer.style.display = "none";
        gameContainer.style.display = "flex";
        initGame();
        startTimer();
    });
    
    // Spiel initialisieren
    function initGame() {
        // Zurücksetzen der Spielvariablen
        hasFlippedCard = false;
        lockBoard = false;
        pairsFound = 0;
        totalFlips = 0;
        timeLeft = 120;
        timerDisplay.textContent = formatTime(timeLeft);
        gameBoard.innerHTML = '';
        
        // Array mit Emoji-Paaren erstellen
        const cardValues = [...emojis, ...emojis];
        
        // Array mischen
        shuffleArray(cardValues);
        
        // Karten erstellen
        cardValues.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = value;
            
            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = value;
            
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }
    
    // Timer starten
    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            
            if (timeLeft <= 10) {
                timerDisplay.style.color = "#ff0000";
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame(false);
            }
        }, 1000);
    }
    
    // Zeit formatieren (MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // Karte umdrehen
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flipped');
        totalFlips++;
        
        if (!hasFlippedCard) {
            // Erste Karte
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Zweite Karte
        secondCard = this;
        checkForMatch();
    }
    
    // Prüfen, ob Karten übereinstimmen
    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        
        if (isMatch) {
            setTimeout(() => {
                firstCard.classList.add('match-animation');
                secondCard.classList.add('match-animation');
                
                setTimeout(() => {
                    firstCard.style.visibility = 'hidden';
                    secondCard.style.visibility = 'hidden';
                    resetBoard();
                    pairsFound++;
                    
                    if (pairsFound === emojis.length) {
                        clearInterval(timer);
                        endGame(true);
                    }
                }, 500);
            }, 500);
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 1000);
        }
    }
    
    // Board zurücksetzen
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // Spiel beenden
    function endGame(isWin) {
        gameOverContainer.style.display = "block";
        
        if (isWin) {
            gameOverMessage.textContent = "Glückwunsch! Du hast gewonnen!";
            gameOverStats.textContent = `Gefundene Paare: ${pairsFound}/10 | Verbleibende Zeit: ${formatTime(timeLeft)} | Züge: ${Math.ceil(totalFlips/2)}`;
            completeLevel();
        } else {
            gameOverMessage.textContent = "Zeit abgelaufen!";
            gameOverStats.textContent = `Gefundene Paare: ${pairsFound}/10 | Züge: ${Math.ceil(totalFlips/2)}`;
        }
    }
    
    // Neu starten
    restartButton.addEventListener('click', function() {
        window.location.href = "../html/map.html";
    });
    
    // Array mischen (Fisher-Yates-Algorithmus)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function completeLevel() {
        // Extrahiere die Level-Nummer aus der URL
        const pathSegments = window.location.pathname.split('/');
        const gameFolder = pathSegments[pathSegments.length - 2]; // z.B. "game1"
        const levelNumber = parseInt(gameFolder.replace('game', '')) || 1;
        
        // Markieren das das Level erfolgreich weurd
        localStorage.setItem(`level${levelNumber}Completed`, 'true');
        
        console.log(`Level ${levelNumber} als abgeschlossen markiert!`);
    }
});