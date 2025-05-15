
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
    
    // Emoji der karten
    const emojis = ["🗺️", "🪙", "🎲", "🎰", "🧭", "💰", "🧱", "🧙‍♂️", "🏴‍☠️", "📦"];
    
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
    
    // Zeit 
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


function leaveBack(){
    window.location.href = "../html/map.html"
}

document.getElementById("start-gambling").addEventListener("click", function () {
    document.getElementById("gamblingMachine").style.display = "block";
    document.getElementById("game-over-container").style.display = "none";
    this.disabled = true; // Button deaktivieren, damit man es nicht mehrfach startet
});

let spinsLeft = 5;
let coinCount = 0;

document.getElementById("gambleButton").addEventListener("click", spin);

function spin() {
    if (spinsLeft <= 0) {
        document.getElementById("winnings").textContent = "Keine Versuche mehr übrig!";
        endGambling(); // ➕
        return;
    }

    spinsLeft--;
    document.getElementById("spinsLeft").textContent = `Versuche übrig: ${spinsLeft}`;

    const symbols = ["🪙", "💎", "⭐", "🎰", "🎁"];
    const slots = [
        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3")
    ];

    document.getElementById("gambleButton").disabled = true;

    // 🌀 Animation starten
    slots.forEach(slot => {
        gsap.fromTo(slot, 
            { scale: 1, rotation: 0 }, 
            { scale: 1.4, rotation: 360, duration: 0.4, ease: "power2.inOut" }
        );
    });

    setTimeout(() => {
        let finalSymbols = [];
        for (let i = 0; i < 3; i++) {
            const symbolIndex = Math.floor(Math.random() * symbols.length);
            finalSymbols.push(symbols[symbolIndex]);
            slots[i].textContent = symbols[symbolIndex];
            slots[i].dataset.symbol = symbols[symbolIndex];

            // 🌀 Finales Einrasten
            gsap.to(slots[i], { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.7)" });
        }

        checkWin();

        if (spinsLeft <= 0) {
            setTimeout(endGambling, 1500); 
        } else {
            document.getElementById("gambleButton").disabled = false;
        }
    }, 700); 
}

function endGambling() {
    document.getElementById("winnings").textContent += " Glücksspiel beendet!";
    document.getElementById("gamblingMachine").style.display = "none";
    document.getElementById("gamblingMachine").style.display = "none";
    document.getElementById("game-over-container").style.display = "block";

    document.getElementById("start-gambling").disabled = false;

    spinsLeft = 5;
}



function checkWin() {
    const s1 = document.getElementById("slot1").dataset.symbol;
    const s2 = document.getElementById("slot2").dataset.symbol;
    const s3 = document.getElementById("slot3").dataset.symbol;

    if (s1 === s2 && s2 === s3) {
        let winAmount = 0;
        switch (s1) {
            case "🪙": winAmount = 10; break;
            case "💎": winAmount = 50; break;
            case "⭐": winAmount = 20; break;
            case "🎰": winAmount = 100; break;
            case "🎁": winAmount = 30; break;
        }
        coinCount += winAmount;
        document.getElementById("winnings").textContent = `🎉 Gewinn: ${winAmount} Münzen!`;
        addCoinsToStorage(winAmount); // ✅ Münzen speichern
        
    } else {
        document.getElementById("winnings").textContent = "Leider kein Gewinn.";
    }
}


function addCoinsToStorage(coins) {
    const currentCoins = parseInt(localStorage.getItem('playerCoins')) || 0;
    const newTotal = currentCoins + coins;
    localStorage.setItem('playerCoins', newTotal);
    console.log(`Neue Münzanzahl gespeichert: ${newTotal}`);
}

//für console zum skippen
window.skipGameAndWin = function() {
    clearInterval(timer); // Timer stoppen
    pairsFound = 10; 
    totalFlips = 20;
    endGame(true); 
    console.log("Spiel wurde übersprungen und als gewonnen markiert.");
};
