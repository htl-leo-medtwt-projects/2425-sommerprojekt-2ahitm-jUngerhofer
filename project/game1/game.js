

let characterPos = { x: 400, y: 100 };
        let currentFrame = 0;
        let isMovingRight = true;
        let itemCount = 0;
        let coinCount = 0;
        let lives = 3;
        let experience = 0;
        let items = [];
        let keyState = {};
        let gamePhase = "start"; // start -> entry -> game -> gambling -> gameOver
        let characterFrames = Array(7).fill(null); 
        let spinsLeft = 5;
        let gameTime = 60; 
        let timerInterval;
        let startTime;
        
        // GSAP-Animation für die Startseite
        // Kommentar: GSAP wird genutzt, um die Titel-Elemente mit einer Animation einzublenden
        function animateStartScreen() {
            // GSAP Timeline für sequentielle Animationen erstellen
            const tl = gsap.timeline();
            
            // Titel mit einem Bounce-Effekt von oben einblenden
            tl.from("h1", {
                y: -100,
                opacity: 0,
                duration: 1,
                ease: "bounce.out"
            });
            
            // Untertitel einblenden
            tl.from(".subtitle", {
                opacity: 0,
                duration: 0.7,
                y: 20
            }, "-=0.3");
            
            // Startbutton pulsieren lassen
            tl.from(".startButton", {
                scale: 0,
                rotation: 180,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.4");
            
            // Kontinuierliche Pulsier-Animation für den Button
            gsap.to(".startButton", {
                scale: 1.05,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
        
        // Spielstart
        function startGame() {
            document.getElementById("startScreen").style.display = "none";
            document.getElementById("entryPhase").style.display = "block";
            gamePhase = "entry";
            

            const character = document.querySelector("#entryPhase #character");
            if (character) {
                character.style.left = "10%";
                character.style.bottom = "50%";
                characterPos.x = parseInt(character.style.left);
                characterPos.y = parseInt(character.style.bottom);
            }
            
            setupKeyboardControls();
            loadCharacterFrames();
            gameLoop();
        }
        // Sprite Animation
        function loadCharacterFrames() {
            for (let i = 0; i < 8; i++) {
                characterFrames[i] = `../img/NoSkin/Run${i+1}.png`;
            }

            console.log(characterFrames);
            
            const entryCharacter = document.querySelector("#entryPhase #character");
            const gameCharacter = document.querySelector("#gameScreen #character");
            
            if (entryCharacter) {
                entryCharacter.style.backgroundImage = `url('${characterFrames[0]}')`;
                entryCharacter.style.backgroundSize = 'contain';
                entryCharacter.style.backgroundRepeat = 'no-repeat';
            }
            
            if (gameCharacter) {
                gameCharacter.style.backgroundImage = `url('${characterFrames[0]}')`;
                gameCharacter.style.backgroundSize = 'contain';
                gameCharacter.style.backgroundRepeat = 'no-repeat';
            }
        }
        
        // Tasten-Setup
        function setupKeyboardControls() {
            window.addEventListener("keydown", function(e) {
                keyState[e.key] = true;
            });
            
            window.addEventListener("keyup", function(e) {
                keyState[e.key] = false;
            });
        }
        
        // Charakter bewegen
        function moveCharacter() {
            let speed = 5;
            let character;
            
            if (gamePhase === "entry") {
                character = document.querySelector("#entryPhase #character");
            } else if (gamePhase === "game") {
                character = document.querySelector("#gameScreen #character");

                const basket = document.getElementById("basket");
                if (basket && character.style.left) {
                    basket.style.left = character.style.left;
                }
            }
            
            if (!character) return; 
            
            if (!character.style.left) character.style.left = characterPos.x + "px";
            if (!character.style.bottom) character.style.bottom = characterPos.y + "px";
            
            let left = parseInt(character.style.left) || characterPos.x;
            let bottom = parseInt(character.style.bottom) || characterPos.y;
                    
            if (keyState["ArrowLeft"] || keyState["a"]) {
                left -= speed;
                isMovingRight = false;
                updateCharacterFrame();
            }
            if (keyState["ArrowRight"] || keyState["d"]) {
                left += speed;
                isMovingRight = true;
                updateCharacterFrame();
            }
            
            if (gamePhase === "entry") {
                if (keyState["ArrowUp"] || keyState["w"]) {
                    bottom += speed;
                    updateCharacterFrame();
                }
                if (keyState["ArrowDown"] || keyState["s"]) {
                    bottom -= speed;
                    updateCharacterFrame();
                }
            }
            
            // Grenzen prüfen
            const containerWidth = 800;
            left = Math.max(0, Math.min(containerWidth - 60, left));
            
            if (gamePhase === "entry") {
                const containerHeight = 600;
                bottom = Math.max(0, Math.min(containerHeight - 100, bottom));
                
                // Level-Eingang prüfen
                const entrance = document.getElementById("levelEntrance");
                const entranceRect = entrance.getBoundingClientRect();
                const characterRect = character.getBoundingClientRect();
                
                if (isColliding(characterRect, entranceRect)) {
                    startGamePhase();
                    return;
                }
            }
            
            character.style.left = left + "px";
            character.style.bottom = bottom + "px";
            characterPos = { x: left, y: bottom };
        }
        
        // Kollision prüfen
        function isColliding(rect1, rect2) {
            return !(
                rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom
            );
        }
        
    
let animationCounter = 0;
const animationSpeed = 10; 


function updateCharacterFrame() {
    animationCounter++;
    if (animationCounter % animationSpeed !== 0) return;
    
    // Animation weiterlaufen lassen
    currentFrame = (currentFrame + 1) % 8;
    
    // Korrigierter Selektor für den Entry-Modus
    let character;
    if (gamePhase === "entry") {
        character = document.querySelector("#entryPhase #character");
    } else if (gamePhase === "game") {
        character = document.querySelector("#gameScreen #character");
    }
    
    if (character && characterFrames[currentFrame]) {
        character.style.backgroundImage = `url('${characterFrames[currentFrame]}')`;
        character.style.backgroundSize = 'contain';
        character.style.backgroundRepeat = 'no-repeat';
        
        //Rückwärtsbewegung
        if (!isMovingRight) {
            character.style.transform = "translateX(-50%) scaleX(-1)";
        } else {
            character.style.transform = "translateX(-50%)";
        }
    }
}
        
function startGamePhase() {
    gamePhase = "game";
    document.getElementById("entryPhase").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("score").style.display = "block";
    document.getElementById("lives").style.display = "block";
    document.getElementById("coins").style.display = "block";
    document.getElementById("experience").style.display = "block";
    document.getElementById("timer").style.display = "block";
    
    const character = document.querySelector("#gameScreen #character");
    character.style.left = "50%";
    character.style.bottom = "100px";
    
    const basket = document.getElementById("basket");
    basket.style.display = "block";
    basket.style.left = character.style.left;
    basket.style.bottom = "60px";
    
    updateExperienceDisplay();

    // Timer 
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    
    // Items
    startGeneratingItems();
}
        

function updateTimer() {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const timeLeft = Math.max(0, gameTime - elapsedSeconds);
    
    document.getElementById("timer").textContent = `Zeit: ${timeLeft}`;
    
    if (timeLeft <= 0) {
        // Zeit abgelaufen
        endGame();
    }
}
        
// Items generieren
function startGeneratingItems() {
    setInterval(function() {
        if (itemCount >= 15 || gamePhase !== "game") return;
        
        const item = document.createElement("div");
        item.className = "item";
        item.style.left = Math.random() * 770 + "px";
        item.style.top = "-40px";
        
        const itemType = Math.random();
        
        if (itemType < 0.6) {
            // 60% Wahrscheinlichkeit für ein einsammelbares Item
            item.classList.add("collectible");
            item.dataset.type = "collectible";
        } else if (itemType < 0.9) {
            // 30% Wahrscheinlichkeit für eine Münze
            item.classList.add("coin");
            item.dataset.type = "coin";
        } else {
            // 10% Wahrscheinlichkeit für ein gefährliches Item
            item.classList.add("dangerous");
            item.dataset.type = "dangerous";
        }
        
        document.getElementById("gameScreen").appendChild(item);
        
        items.push({
            element: item,
            speed: 1 + Math.random() * 3
        });
    }, 800);
}
        
function moveItems() {
    if (gamePhase !== "game") return;
    
    const basketElement = document.getElementById("basket");
    const basketRect = basketElement.getBoundingClientRect();
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const top = parseInt(item.element.style.top) || 0;
        
        item.element.style.top = (top + item.speed) + "px";
        
        // Kollision mit dem Fass prüfen
        const itemRect = item.element.getBoundingClientRect();
        
        if (isColliding(itemRect, basketRect)) {
            const itemType = item.element.dataset.type;
            
            if (itemType === "collectible") {
                // Einsammelbares Item
                itemCount++;
                document.getElementById("score").textContent = `Items: ${itemCount}/15`;
                
                // finsih
                if (itemCount >= 15) {
                    setTimeout(showGamblingMachine, 1000);
                }
            } else if (itemType === "coin") {
                // Münze
                coinCount++;
                document.getElementById("coins").textContent = `Münzen: ${coinCount}`;
                
                // aktualisieren des localstorages (coin)
                const storedCoins = localStorage.getItem("playerCoins") || "0";
                localStorage.setItem("playerCoins", parseInt(storedCoins) + 1);
                
            } else if (itemType === "dangerous") {
                // Gefährliches Item
                lives--;
                document.getElementById("lives").textContent = `Leben: ${lives}`;
                
                // Game Over?
                if (lives <= 0) {
                    endGame();
                }
            }
            
            // Item entfernen
            item.element.remove();
            items.splice(i, 1);
            i--;
            
            continue;
        }
        
        // ausserhalb des bilschirms (charakter)
        if (top > 600) {
            item.element.remove();
            items.splice(i, 1);
            i--;
        }
    }
}
        
function showGamblingMachine() {
    gamePhase = "gambling";
    clearInterval(timerInterval); // Timer stoppen
    document.getElementById("gamblingMachine").style.display = "block";
}

// Gambling Machine
function spin() {
    if (spinsLeft <= 0) {
        document.getElementById("winnings").textContent = "Keine Versuche mehr übrig!";
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

// Spiel beenden
function endGame() {
    gamePhase = "gameOver";
    clearInterval(timerInterval);
    
    // Erfahrung berechnen basierend auf Zeit und verbleibenden Leben und items
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const timePoints = Math.max(0, 60 - elapsedSeconds);
    const lifePoints = lives * 3;
    const itemPoints = itemCount * 0.5;
    
    // Erfahrung zwischen 1 und 20 begrenzen!
    experience = Math.min(20, Math.max(1, Math.floor(timePoints + lifePoints + itemPoints)));
    
    // Erfahrung zum localStorage hinzufügen
    const storedXP = localStorage.getItem("playerXP") || "0";
    localStorage.setItem("playerXP", parseInt(storedXP) + experience);
    
    // Markiere das Level als abgeschlossen, wenn genügend Items gesammelt wurden
    if (itemCount >= 15) {
        completeLevel(); 
    }

    updatePlayerProgress();
    
    // Game Over Anzeige anzeigen
    document.getElementById("finalScore").textContent = `Items gesammelt: ${itemCount}/15`;
    document.getElementById("finalCoins").textContent = `Münzen gesammelt: ${coinCount}`;
    document.getElementById("finalExperience").textContent = `Erfahrung erhalten: ${experience}`;
    
    document.getElementById("gameOver").style.display = "block";
}

function updateExperienceDisplay() {
    document.getElementById("experience").textContent = `XP: ${experience}/20`;
}

function updatePlayerProgress() {
    let gameData = JSON.parse(localStorage.getItem('gameData') || '{}');
    
    if (!gameData.coins) gameData.coins = 0;
    if (!gameData.experience) gameData.experience = 0;
    if (!gameData.level) gameData.level = 1;
    
    // Münzen und Erfahrung aktualisieren
    gameData.coins += coinCount;
    gameData.experience += experience;
                
    const expNeededForNextLevel = gameData.level * 100;
    if (gameData.experience >= expNeededForNextLevel) {
        gameData.level += 1;
        // Optional: Benachrichtigung über Level-Up
        alert(`Level aufgestiegen! Du bist jetzt Level ${gameData.level}!`);
    }
    
    localStorage.setItem('gameData', JSON.stringify(gameData));
    
    console.log(`Fortschritt aktualisiert: Level ${gameData.level}, XP ${gameData.experience}, Münzen ${gameData.coins}`);
}

// Spiel neu starten
function restartGame() {
    // Alles zurücksetzen
    itemCount = 0;
    coinCount = 0;
    lives = 3;
    experience = 0;
    spinsLeft = 5;
    gameTime = 60;
    items.forEach(item => item.element.remove());
    items = [];
    
    // UI zurücksetzen
    document.getElementById("score").textContent = `Items: 0/15`;
    document.getElementById("lives").textContent = `Leben: 3`;
    document.getElementById("coins").textContent = `Münzen: 0`;
    document.getElementById("experience").textContent = `XP: 0`;
    document.getElementById("timer").textContent = `Zeit: 60`;
    document.getElementById("spinsLeft").textContent = `Versuche übrig: 3`;
    document.getElementById("winnings").textContent = ``;
    
    // Screens zurücksetzen
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("gamblingMachine").style.display = "none";
    document.getElementById("gameScreen").style.display = "none";
    
    // Startscreen anzeigen
    document.getElementById("startScreen").style.display = "flex";
    gamePhase = "start";

    window.location = '../html/map.html';
}

// Haupt-Game-Loop
function gameLoop() {
    if (gamePhase !== "start" && gamePhase !== "gameOver") {
        moveCharacter();
        if (gamePhase === "game") {
            moveItems();
        }
    }
    
    requestAnimationFrame(gameLoop);
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

// Startanimation und Spiel initialisieren
window.onload = function() {
    animateStartScreen();
    
    // Prüfen bei bereits Werte im localStorage vorhanden sind
    if (!localStorage.getItem("playerCoins")) {
        localStorage.setItem("playerCoins", "0");
    }
    if (!localStorage.getItem("playerXP")) {
        localStorage.setItem("playerXP", "0");
    }
};