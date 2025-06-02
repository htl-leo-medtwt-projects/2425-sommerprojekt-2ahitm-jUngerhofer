const levels = [4, 7, 12]; // Sekunden Timer
  let currentLevel = 0;

  const startScreen = document.getElementById('startScreen');
  const startButton = document.getElementById('startButton');
  const animationScreen = document.getElementById('animationScreen');

  const timerDisplay = document.getElementById('timerDisplay');
  const message = document.getElementById('message');
  const instructions = document.getElementById('instructions');
  const levelStatus = document.getElementById('levelStatus');

  const gamblingMachine = document.getElementById('gamblingMachine');
  const gambleButton = document.getElementById('gambleButton');
  const slot1 = document.getElementById('slot1');
  const slot2 = document.getElementById('slot2');
  const slot3 = document.getElementById('slot3');
  const winnings = document.getElementById('winnings');
  const spinsLeftDisplay = document.getElementById('spinsLeft');

  let countdownStart = 0;
  let countdownDuration = 0;
  let timerPhase = 'waiting'; // 'waiting', 'showing', 'hidden', 'finished'
  let animationFrameId;
  let guessMade = false;

  const animationImg = document.getElementsByClassName('animationImage');
 // animationImg.style.backgroundImage = localStorage.getItem("currentSkin");

  // Gambling Maschine
  let spinsLeft = 5;

  function updateLevelStatus() {
    levelStatus.textContent = `Timer Level: ${currentLevel + 1}/3`;
  }

  function showAnimation() {
    return new Promise((resolve) => {
      animationScreen.style.display = 'flex';
      setTimeout(() => {
        animationScreen.style.display = 'none';
        resolve();
      }, 2000); 
    });
  }

  async function startLevel(levelIndex) {
    guessMade = false;
    message.textContent = '';
    timerPhase = 'waiting';
    updateLevelStatus();
    
    // Animation zeigen
    await showAnimation();
    
    // Timer Setup
    countdownDuration = levels[levelIndex] * 1000;
    countdownStart = performance.now();
    timerPhase = 'showing';
    
    timerDisplay.style.color = 'red';
    timerDisplay.style.fontWeight = '900';
    timerDisplay.style.display = 'block';
    instructions.style.display = 'none';
    gamblingMachine.style.display = 'none';
    
    // Zeit anzeige für de start
    setTimeout(() => {
      timerPhase = 'hidden';
      timerDisplay.style.display = 'none';
      instructions.style.display = 'block';
      message.textContent = 'Timer läuft!';
    }, 1000);
    
    drawTimer();
  }

  function drawTimer() {
    animationFrameId = requestAnimationFrame(drawTimer);
    const now = performance.now();
    let elapsed = now - countdownStart;

    if (timerPhase === 'showing') {
      let timeLeft = Math.max(0, countdownDuration - elapsed);
      timerDisplay.textContent = (timeLeft / 1000).toFixed(2);
    }
  }

  function endGame(win) {
    cancelAnimationFrame(animationFrameId);
    instructions.style.display = 'none';
    timerDisplay.style.display = 'none';

    if (win) {
      message.style.color = '#0f0';
      message.textContent = `Glückwunsch! Alle Level geschafft!`;
      // Gambling Maschine zeigen
      gamblingMachine.style.display = 'block';
      spinsLeft = 5;
      spinsLeftDisplay.textContent = `Versuche übrig: ${spinsLeft}`;
      winnings.textContent = '';

      
      // Level im LocalStorage aktualisieren
      updateProgress();
    } else {
      message.style.color = '#f00';
      message.textContent = `Leider verloren! Du warst zu weit weg.`;
      // Button zum neu starten zeigen
      setTimeout(() => {
        startScreen.style.display = 'flex';
        levelStatus.style.display = 'none';
      }, 3000);
    }
  }

  function updateProgress() {
    try {
    // Extrahiere die Level-Nummer aus der URL
    const pathSegments = window.location.pathname.split('/');
    const gameFolder = pathSegments[pathSegments.length - 2]; // z.B. "game1"
    const levelNumber = parseInt(gameFolder.replace('game', '')) || 1;
    
    // Markieren das das Level erfolgreich weurd
    localStorage.setItem(`level${levelNumber}Completed`, 'true');
    
    console.log(`Level ${levelNumber} als abgeschlossen markiert!`);
    
    } catch (error) {
      console.error('Fehler beim Speichern des Fortschritts:', error);
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !guessMade && timerPhase === 'hidden' && gamblingMachine.style.display === 'none') {
      e.preventDefault();
      guessMade = true;
      const guessTime = performance.now();
      const elapsed = guessTime - countdownStart;

      // Restzeit bis 0 berechnen (kann negativ werden)
      const timeLeft = (countdownDuration - elapsed) / 1000;
      
      // Zeit anzeigen für Feedback
      timerDisplay.style.display = 'block';
      timerDisplay.textContent = timeLeft.toFixed(2);
      
      // Abweichung von 0 berechnen
      const diff = Math.abs(timeLeft);
      
      if (diff <= 0.5) {
        timerDisplay.style.color = 'green';
        message.style.color = '#0f0';
        message.textContent = `Perfekt! Abweichung: ${diff.toFixed(2)}s`;
        
        currentLevel++;
        if (currentLevel >= levels.length) {
          cancelAnimationFrame(animationFrameId);
          setTimeout(() => {
            timerDisplay.style.display = 'none';
            instructions.style.display = 'none';
            message.style.color = '#0f0';
            message.textContent = `Alle Level geschafft!`;
            gamblingMachine.style.display = 'block';
            spinsLeft = 5;
            spinsLeftDisplay.textContent = `Versuche übrig: ${spinsLeft}`;
            winnings.textContent = '';
            updateProgress();
          }, 2000);
        } else {
          setTimeout(() => {
            startLevel(currentLevel);
          }, 2000);
        }
      } else {
        timerDisplay.style.color = 'red';
        message.style.color = '#f00';
        message.textContent = `Zu ungenau! Abweichung: ${diff.toFixed(2)}s`;
        setTimeout(() => {
          endGame(false);
        }, 2000);
      }
    }
  });

  startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    levelStatus.style.display = 'block';
    currentLevel = 0;
    message.textContent = '';
    startLevel(currentLevel);
  });

  function showGamblingMachine() {
    gamePhase = "gambling";
    clearInterval(timerInterval); // Timer stoppen
    document.getElementById("gamblingMachine").style.display = "block";
}

// Gambling Machine
function spin() {
    if (spinsLeft <= 0) {
        document.getElementById("winnings").textContent = "Keine Versuche mehr übrig!";
        window.location.href = "../html/map.html";
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
    
    //diable button während gedrhet wird => verhinderung doppeltes drehen
    document.getElementById("gambleButton").disabled = true;
    
    // Kurze Animation mit GSAP
    //GSAP für Gambling
    gsap.to(slots, {
        rotation: 360,
        duration: 0.5,
        ease: "power1.inOut",
        onComplete: function() {
            let finalSymbols = [];
            
            for (let i = 0; i < 3; i++) {
                const symbolIndex = Math.floor(Math.random() * symbols.length);
                finalSymbols.push(symbols[symbolIndex]);
                slots[i].textContent = symbols[symbolIndex];
                slots[i].dataset.symbol = symbols[symbolIndex];
            }
            
            gsap.set(slots, { rotation: 0 });
            
            checkWin();
            
            // beenden wenn spins 0 ergeben
            if (spinsLeft <= 0) {
                completeLevel(); //wenn alle spins fertig sind weird das Spiel ebenso auf erfolgreich geranked
                setTimeout(endGame, 2000);
            }
        }
    });
}

// Prüfen, ob Gewinn
function checkWin() {
    const slots = [
        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3")
    ];
    
    const symbols = slots.map(slot => slot.dataset.symbol);
    
    // Alle gleich?
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        // Gewinn!
        let winAmount = 0;
        
        // Je nach Symbol unterschiedliche Beträge
        switch (symbols[0]) {
            case "🪙": winAmount = 10; break;
            case "💎": winAmount = 50; break;
            case "⭐": winAmount = 20; break;
            case "🎰": winAmount = 100; break;
            case "🎁": winAmount = 30; break;
        }
        
        document.getElementById("winnings").textContent = `Gewonnen: ${winAmount} Münzen!`;
        
        // Münzen zum Spielstand hinzufügen
        coinCount += winAmount;
        document.getElementById("coins").textContent = `Münzen: ${coinCount}`;
        
        // Münzen zum localStorage hinzufügen
        const storedCoins = localStorage.getItem("playerCoins") || "0";
        localStorage.setItem("playerCoins", parseInt(storedCoins) + winAmount);
        
        // GSAP Animation für den Gewinn
        // Kommentar: GSAP für die Animation des Gewinntextes
        gsap.from("#winnings", {
            scale: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
    } else {
        document.getElementById("winnings").textContent = "Leider kein Gewinn.";
    }
    
    
    document.getElementById("gambleButton").disabled = false;
}

  gambleButton.addEventListener('click', () => {
    showGamblingMachine();
    /*if (spinsLeft <= 0) {
      winnings.textContent = 'Keine Versuche mehr!';
      return;
    }
    spinsLeft--;
    spinsLeftDisplay.textContent = `Versuche übrig: ${spinsLeft}`;


    slot1.textContent = '🎰';
    slot2.textContent = '🎰';
    slot3.textContent = '🎰';

    setTimeout(() => {
      const slotValues = [];
      for (let i = 0; i < 3; i++) {
        slotValues[i] = Math.floor(Math.random() * 7) + 1;
      }
      slot1.textContent = slotValues[0];
      slot2.textContent = slotValues[1];
      slot3.textContent = slotValues[2];

      if (slotValues[0] === slotValues[1] && slotValues[1] === slotValues[2]) {
        winnings.textContent = '🎉 Jackpot! Du hast gewonnen!';
        winnings.style.color = '#ffcc00';
      } else if (slotValues[0] === slotValues[1] || slotValues[1] === slotValues[2] || slotValues[0] === slotValues[2]) {
        winnings.textContent = '✨ Zwei gleiche! Kleiner Gewinn!';
        winnings.style.color = '#90EE90';
      } else {
        winnings.textContent = 'Leider kein Gewinn, versuch es nochmal!';
        winnings.style.color = '#ff6b6b';
      }

      if (spinsLeft === 0) {
        setTimeout(() => {
          winnings.textContent += ' Spiel beendet!';
          setTimeout(() => {
            window.location.href = "../html/map.html";
          }, 3000);
        }, 2000);
      }
    }, 1000);*/
  });

  function completeLevel() {
    const pathSegments = window.location.pathname.split('/');
    const gameFolder = pathSegments[pathSegments.length - 2]; // z.B. "game1"
    const levelNumber = parseInt(gameFolder.replace('game', '')) || 1;
    
    localStorage.setItem(`level${levelNumber}Completed`, 'true');
    
    console.log(`Level ${levelNumber} als abgeschlossen markiert!`);
}

  window.addEventListener('load', () => {
    try {
      const progress = JSON.parse(localStorage.getItem('gameProgress')) || {};
      console.log('Aktueller Fortschritt:', progress);
    } catch (error) {
      console.error('Fehler beim Laden des Fortschritts:', error);
    }
  });