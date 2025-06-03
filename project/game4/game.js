let characterPos = { x: 100, y: 300 };
let currentFrame = 0;
let isMovingRight = true;
let gamePhase = "start"; // start -> entry -> countdown -> game -> gambling -> gameOver
let characterFrames = Array(8).fill(null);
let animationCounter = 0;
let animationSpeed = 10;
let score = 0;
let lives = 3;
let coinCount = 0;
let experience = 0;
let gameTime = 45;
let timerInterval;
let startTime;
let balls = [];
let keyState = {};
let spinsLeft = 5;
let ballSpeed = 1.6;
let activeBall = null;
let targetScore = 20;

// Farben für die Bälle
const colors = ['red', 'blue', 'green', 'yellow'];

// GSAP Animation für Startscreen
function animateStartScreen() {
    const tl = gsap.timeline();
    
    tl.from("h1", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "bounce.out"
    });
    
    tl.from(".subtitle", {
        opacity: 0,
        duration: 0.7,
        y: 20
    }, "-=0.3");
    
    tl.from(".startButton", {
        scale: 0,
        rotation: 180,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.4");
    
    gsap.to(".startButton", {
        scale: 1.05,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

// Spiel starten (Entry Phase)
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("entryPhase").style.display = "block";
    gamePhase = "entry";
    
    // Charakter initialisieren
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

// Sprite Animation laden
function loadCharacterFrames() {
    for (let i = 0; i < 8; i++) {
        characterFrames[i] = `../img/Mage/Run${i + 1}.png`;
    }

    const entryCharacter = document.querySelector("#entryPhase #character");

    if (entryCharacter) {
        entryCharacter.style.backgroundImage = `url('${characterFrames[0]}')`;
        entryCharacter.style.backgroundSize = 'contain';
        entryCharacter.style.backgroundRepeat = 'no-repeat';
    }
}



// Keyboard Setup
function setupKeyboardControls() {
    window.addEventListener("keydown", function(e) {
        keyState[e.key] = true;
        e.preventDefault();
    });
    
    window.addEventListener("keyup", function(e) {
        keyState[e.key] = false;
        e.preventDefault();
    });
}

// Charakter bewegen
function moveCharacter() {
    let speed = 5;
    let character;
    
    if (gamePhase === "entry") {
        character = document.querySelector("#entryPhase #character");
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
    if (keyState["ArrowUp"] || keyState["w"]) {
        bottom += speed;
        updateCharacterFrame();
    }
    if (keyState["ArrowDown"] || keyState["s"]) {
        bottom -= speed;
        updateCharacterFrame();
    }
    
    // Grenzen prüfen
    left = Math.max(0, Math.min(window.innerWidth - 60, left));
    bottom = Math.max(0, Math.min(window.innerHeight - 100, bottom));
    
    // Level-Eingang prüfen
    if (gamePhase === "entry") {
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

// Sprite Animation aktualisieren
function updateCharacterFrame() {
    animationCounter++;
    if (animationCounter % animationSpeed !== 0) return;
    
    currentFrame = (currentFrame + 1) % 8;
    
    let character;
    if (gamePhase === "entry") {
        character = document.querySelector("#entryPhase #character");
    }
    
    if (character && characterFrames[currentFrame]) {
        character.style.backgroundImage = `url('${characterFrames[currentFrame]}')`;
        character.style.backgroundSize = 'contain';
        character.style.backgroundRepeat = 'no-repeat';
        
        if (!isMovingRight) {
            character.style.transform = "translateX(-50%) scaleX(-1)";
        } else {
            character.style.transform = "translateX(-50%)";
        }
    }
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

// Game Phase starten (mit Countdown)
function startGamePhase() {
    gamePhase = "countdown";
    document.getElementById("entryPhase").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    
    showCountdown();
}

function showCountdown() {
    const counter = document.getElementById("counter");
    counter.style.display = "block";
    let count = 3;
    
    const countdownInterval = setInterval(() => {
        counter.textContent = count;
        
        // GSAP Animation für Countdown
        gsap.fromTo(counter, 
            { scale: 0, opacity: 0 }, 
            { scale: 1.2, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
        
        gsap.to(counter, {
            scale: 0.8,
            opacity: 0.5,
            duration: 0.7,
            delay: 0.3
        });
        
        count--;
        
        if (count < 0) {
            clearInterval(countdownInterval);
            counter.textContent = "START!";
            
            gsap.fromTo(counter, 
                { scale: 0, opacity: 0 }, 
                { scale: 1.5, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
            
            setTimeout(() => {
                counter.style.display = "none";
                actuallyStartGame();
            }, 1000);
        }
    }, 1000);
}

function actuallyStartGame() {
    gamePhase = "game";

    document.body.style.backgroundImage = "url('../img/höhleLvl4.webp')";
    document.getElementById('gameScreen').style.backgroundImage = "url('../img/img4LvlInside.webp)";
    document.getElementById('gameScreen').style.backgroundSize = "cover;";
    document.body.style.backgroundSize = "cover;";

    setupKeyboardControls();
    startTimer();
    startGeneratingBalls();
    updateUI();
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const timeLeft = Math.max(0, gameTime - elapsedSeconds);
    
    document.getElementById("timer").textContent = `Zeit: ${timeLeft}`;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

function startGeneratingBalls() {
    setInterval(function() {
        if (gamePhase !== "game" || balls.length >= 8) return;
        
        const ball = document.createElement("div");
        ball.className = "ball";
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        ball.classList.add(randomColor);
        ball.dataset.color = randomColor;
        
        ball.style.left = Math.random() * (800 - 40) + "px";
        ball.style.top = "-40px";
        
        document.getElementById("gameScreen").appendChild(ball);
        
        balls.push({
            element: ball,
            color: randomColor,
            x: parseInt(ball.style.left),
            y: parseInt(ball.style.top),
            controlled: false
        });
        
    }, 1500 - (score * 15));
}

function moveBalls() {
    if (gamePhase !== "game") return;
    
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        
        if (!ball.controlled) {
            ball.y += ballSpeed;
            ball.element.style.top = ball.y + "px";
            
            if (ball.y >= 480) {
                checkColorMatch(ball, i);
                continue;
            }
        } else {
            handlePlayerControl(ball);
        }
        
        if (ball.y > 600) {
            ball.element.remove();
            balls.splice(i, 1);
            i--;
            
            if (!ball.controlled) {
                lives--;
                updateUI();
                
                if (lives <= 0) {
                    endGame();
                }
            }
        }
    }
}

function handlePlayerControl(ball) {
    let speed = 7;
    
    if (keyState["ArrowLeft"] || keyState["a"]) {
        ball.x = Math.max(0, ball.x - speed);
    }
    if (keyState["ArrowRight"] || keyState["d"]) {
        ball.x = Math.min(760, ball.x + speed);
    }
    if (keyState["ArrowUp"] || keyState["w"]) {
        ball.y = Math.max(0, ball.y - speed);
    }
    if (keyState["ArrowDown"] || keyState["s"]) {
        ball.y = Math.min(560, ball.y + speed);
    }
    
    ball.element.style.left = ball.x + "px";
    ball.element.style.top = ball.y + "px";
    
    if (ball.y >= 480) {
        checkColorMatch(ball, balls.indexOf(ball));
    }
}

// Farbe überprüfen
function checkColorMatch(ball, index) {
    const ballCenterX = ball.x + 20;
    const zoneWidth = 200;
    const zoneIndex = Math.floor(ballCenterX / zoneWidth);
    
    const zones = document.querySelectorAll('.colorZone');
    const targetZone = zones[zoneIndex];
    
    if (targetZone && ball.color === targetZone.dataset.color) {
        score++;
        coinCount += Math.floor(Math.random() * 3) + 1;
        
        gsap.to(ball.element, {
            scale: 1.5,
            opacity: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
            onComplete: function() {
                ball.element.remove();
            }
        });
        
        targetZone.classList.add('active');
        setTimeout(() => targetZone.classList.remove('active'), 200);
        
        if (score >= targetScore) {
            setTimeout(showGamblingMachine, 1000);
        }
        
    } else {
        lives--;
        
        gsap.to(ball.element, {
            x: "+=20",
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            ease: "power2.inOut",
            onComplete: function() {
                ball.element.remove();
            }
        });
        
        if (lives <= 0) {
            endGame();
        }
    }
    
    balls.splice(index, 1);
    updateUI();
}

function updateUI() {
    document.getElementById("score").textContent = `Punkte: ${score}/${targetScore}`;
    document.getElementById("lives").textContent = `Leben: ${lives}`;
    document.getElementById("coins").textContent = `Münzen: ${coinCount}`;
    document.getElementById("experience").textContent = `XP: ${experience}`;
}

// Ball anklicken für Kontrolle
        // Ball anklicken für Kontrolle
        document.addEventListener('click', function(e) {
    if (gamePhase !== "game") return;

    const clickedBall = balls.find(ball => {
        const rect = ball.element.getBoundingClientRect();
        return (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );
    });

    if (clickedBall) {
        balls.forEach(ball => ball.controlled = false);
        clickedBall.controlled = true;
        activeBall = clickedBall;
    }
});

function showGamblingMachine() {
    gamePhase = "gambling";
    clearInterval(timerInterval);
    document.getElementById("gamblingMachine").style.display = "block";
}

function spin() {
    if (spinsLeft <= 0) return;
    spinsLeft--;

    const slot1 = document.getElementById("slot1");
    const slot2 = document.getElementById("slot2");
    const slot3 = document.getElementById("slot3");

    const items = ['🍒', '💎', '⭐', '7️⃣'];
    const results = [
        items[Math.floor(Math.random() * items.length)],
        items[Math.floor(Math.random() * items.length)],
        items[Math.floor(Math.random() * items.length)]
    ];

    slot1.textContent = results[0];
    slot2.textContent = results[1];
    slot3.textContent = results[2];

    let win = 0;
    if (results[0] === results[1] && results[1] === results[2]) {
        win = 10;
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        win = 5;
    }

    coinCount += win;
    experience += win * 2;

    document.getElementById("winnings").textContent = win > 0 ? `Gewonnen: ${win} Münzen!` : `Nichts gewonnen!`;
    document.getElementById("spinsLeft").textContent = `Versuche übrig: ${spinsLeft}`;

    updateUI();

    if (spinsLeft === 0) {
        setTimeout(endGame, 2000);
    }
}

function endGame() {
    gamePhase = "gameOver";
    clearInterval(timerInterval);
    completeLevel();
    updatePlayerProgress();
    document.getElementById("gamblingMachine").style.display = "none";
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("gameOver").style.display = "block";

    document.getElementById("finalScore").textContent = `Punkte: ${score}`;
    document.getElementById("finalCoins").textContent = `Münzen gesammelt: ${coinCount}`;
    document.getElementById("finalExperience").textContent = `Erfahrung erhalten: ${experience}`;
}

function restartGame() {
    window.location = '../html/map.html';
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    moveCharacter();
    moveBalls();
}

animateStartScreen();

function completeLevel() {
    // Extrahiere die Level-Nummer aus der URL
    const pathSegments = window.location.pathname.split('/');
    const gameFolder = pathSegments[pathSegments.length - 2]; // z.B. "game1"
    const levelNumber = parseInt(gameFolder.replace('game', '')) || 1;
    
    // Markieren das das Level erfolgreich weurd
    localStorage.setItem(`level${levelNumber}Completed`, 'true');
    
    console.log(`Level ${levelNumber} als abgeschlossen markiert!`);
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
    }
    
    localStorage.setItem('gameData', JSON.stringify(gameData));
    
    console.log(`Fortschritt aktualisiert: Level ${gameData.level}, XP ${gameData.experience}, Münzen ${gameData.coins}`);
}
