// Game state variables
let gameState = {
    coins: 100,
    experience: 0,
    totalWins: 0,
    totalSpins: 0,
    isGameActive: true,
    isSpinning: false
};

// Slot symbols with different probabilities (harder to win)
const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '⭐', '🎯'];
const rarityWeights = [30, 25, 20, 15, 8, 5, 3, 2]; // More common symbols have higher weight
const symbolValues = [15, 16, 17, 18, 20, 22, 24, 25]; // Payout values for each symbol

// Winning lines (indices in the 3x4 grid) - only first 3 lines have HTML elements
const winLines = [
    [4, 5, 6],      // Middle row (main horizontal line)
    [0, 5, 10],     // Diagonal top-left to bottom-right
    [2, 5, 8]       // Diagonal top-right to bottom-left
];

// Create audio context for sound effects
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playLeverSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playWinSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function createSlots() {
    const grid = document.getElementById('slotsGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = `slot${i}`;
        slot.textContent = '🎯';
        grid.appendChild(slot);
    }
}

function updateDisplay() {
    document.getElementById('coins').textContent = gameState.coins;
    document.getElementById('experience').textContent = gameState.experience;
    document.getElementById('totalWins').textContent = gameState.totalWins;
    
    // Check for victory condition
    if (gameState.coins >= 300 && gameState.isGameActive) {
        setTimeout(() => {
            showVictory();
        }, 1000);
        return;
    }
    
    if (gameState.coins < 10) {
        document.getElementById('spinsInfo').textContent = 'Spiel beendet - Keine Münzen mehr!';
    } else {
        document.getElementById('spinsInfo').textContent = `Münzen: ${gameState.coins} | Ziel: 300 Münzen | Nächster Spin: -10 Münzen`;
    }
}

function getRandomSymbol() {
    const totalWeight = rarityWeights.reduce((sum, weight) => sum + weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (let i = 0; i < symbols.length; i++) {
        randomNum -= rarityWeights[i];
        if (randomNum <= 0) {
            return symbols[i];
        }
    }
    return symbols[0];
}

function pullLever() {
    if (gameState.isSpinning || gameState.coins < 10) return;
    
    const lever = document.getElementById('lever');
    lever.classList.add('pulled');
    playLeverSound();
    
    setTimeout(() => {
        lever.classList.remove('pulled');
        spin();
    }, 300);
}

function spin() {
    if (gameState.coins < 10 || !gameState.isGameActive || gameState.isSpinning) return;

    gameState.isSpinning = true;
    gameState.coins -= 10;
    gameState.totalSpins++;

    // Clear previous winning highlights
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('winning-slot');
    });
    
    document.querySelectorAll('.payline').forEach(line => {
        line.classList.remove('active');
    });

    // Add spinning animation
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => slot.classList.add('spinning'));

    document.getElementById('resultMessage').textContent = 'Spinning...';

    setTimeout(() => {
        // Generate results for all 12 slots
        const results = [];
        for (let i = 0; i < 12; i++) {
            results.push(getRandomSymbol());
        }
        
        // Update slot displays
        slots.forEach((slot, index) => {
            slot.textContent = results[index];
            slot.classList.remove('spinning');
        });

        // Check for wins
        let totalWinAmount = 0;
        let winMessages = [];
        let winningLines = [];

        winLines.forEach((line, lineIndex) => {
            const lineSymbols = line.map(index => results[index]);
            
            // Only check for 3 matching symbols (no more 2-symbol wins)
            if (lineSymbols[0] === lineSymbols[1] && lineSymbols[1] === lineSymbols[2]) {
                const symbolIndex = symbols.indexOf(lineSymbols[0]);
                const winAmount = symbolValues[symbolIndex] || 15;
                totalWinAmount += winAmount;
                winMessages.push(`Linie ${lineIndex + 1}: +${winAmount}`);
                winningLines.push(lineIndex);
                
                // Highlight winning slots
                line.forEach(slotIndex => {
                    document.getElementById(`slot${slotIndex}`).classList.add('winning-slot');
                });
            }
        });

        // Highlight active paylines (only if lineIndex is within bounds)
        winningLines.forEach(lineIndex => {
            const paylineElement = document.getElementById(`line${lineIndex + 1}`);
            if (paylineElement) {
                paylineElement.classList.add('active');
            }
        });

        gameState.coins += totalWinAmount;

        // Display result
        const resultElement = document.getElementById('resultMessage');
        if (totalWinAmount > 0) {
            gameState.totalWins++;
            gameState.experience += Math.floor(totalWinAmount / 10) * 5;
            resultElement.textContent = `🎉 ${winMessages.join(' | ')} | Total: +${totalWinAmount} Münzen!`;
            resultElement.className = 'win';
            playWinSound();
        } else {
            resultElement.textContent = '😔 Kein Gewinn. Versuche es nochmal!';
            resultElement.className = 'lose';
            gameState.experience += 2;
        }

        // Check game over condition
        if (gameState.coins < 10) {
            setTimeout(() => {
                showGameOver();
            }, 3000);
        }

        gameState.isSpinning = false;
        updateDisplay();
    }, 1500);

    updateDisplay();
}

function showVictory() {
    gameState.isGameActive = false;
    const victoryDiv = document.getElementById('victoryScreen');
    const victoryStats = document.getElementById('victoryStats');
    
    victoryStats.innerHTML = `
        <p><strong>🎯 Spins benötigt:</strong> ${gameState.totalSpins}</p>
        <p><strong>🏆 Gewinne:</strong> ${gameState.totalWins}</p>
        <p><strong>💰 Endmünzen:</strong> ${gameState.coins}</p>
        <p><strong>⭐ Erfahrung:</strong> ${gameState.experience}</p>
    `;
    
    victoryDiv.style.display = 'flex';
    playWinSound();
}

function showGameOver() {
    gameState.isGameActive = false;
    const gameOverDiv = document.getElementById('gameOver');
    const finalStats = document.getElementById('finalStats');
    
    finalStats.innerHTML = `
        <p>🎯 Gesamte Spins: ${gameState.totalSpins}</p>
        <p>🏆 Gesamte Gewinne: ${gameState.totalWins}</p>
        <p>💰 Höchste Münzen: ${Math.max(gameState.coins, 100)}</p>
        <p>⭐ Gesammelte Erfahrung: ${gameState.experience}</p>
        <p>📊 Gewinnrate: ${gameState.totalSpins > 0 ? Math.round((gameState.totalWins / gameState.totalSpins) * 100) : 0}%</p>
    `;
    
    gameOverDiv.style.display = 'flex';
}

function restartGame() {
    gameState = {
        coins: 100,
        experience: 0,
        totalWins: 0,
        totalSpins: 0,
        isGameActive: true,
        isSpinning: false
    };
    
    // Reset slots
    createSlots();
    
    // Clear messages and highlights
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('resultMessage').className = '';
    
    document.querySelectorAll('.payline').forEach(line => {
        line.classList.remove('active');
    });
    
    // Hide game over screens
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'none';
    
    updateDisplay();
}

// Initialize game
createSlots();
updateDisplay();

// Enable audio on first user interaction
document.addEventListener('click', initAudio, { once: true });