document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  
  function openShop() {
    document.getElementById("sigmaShop").style.display = "block";
    document.getElementById("sigmaMap").style.display = "none";
    document.getElementById("sigmaCharacter").style.display = "none";
    
    
    document.getElementById("shopBtn").classList.add("active");
    document.getElementById("mapBtn").classList.remove("active");
    document.getElementById("charBtn").classList.remove("active");
}

function openMap() {
    document.getElementById("sigmaShop").style.display = "none";
    document.getElementById("sigmaMap").style.display = "block";
    document.getElementById("sigmaCharacter").style.display = "none";
    
  
    document.getElementById("shopBtn").classList.remove("active");
    document.getElementById("mapBtn").classList.add("active");
    document.getElementById("charBtn").classList.remove("active");
}

function openCharacter() {
    document.getElementById("sigmaShop").style.display = "none";
    document.getElementById("sigmaMap").style.display = "none";
    document.getElementById("sigmaCharacter").style.display = "block";
    

    document.getElementById("shopBtn").classList.remove("active");
    document.getElementById("mapBtn").classList.remove("active");
    document.getElementById("charBtn").classList.add("active");
}


window.onload = function() {
    openMap();
};

// Game data
let gameData = {
    playerName: "Player",
    level: 1,
    experience: 0,
    coins: 100,
    unlockedLevels: [1],
    ownedSkins: ["default"],
    currentSkin: "default",
    freeSpins: 1
};

// Load game data from localStorage if exists
function loadGameData() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
        gameData = JSON.parse(savedData);
        updateUI();
    }
}

// Save game data to localStorage
function saveGameData() {
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Update UI with current game data
function updateUI() {
    document.getElementById("playerName").textContent = gameData.playerName;
    document.getElementById("playerLevel").textContent = gameData.level;
    document.getElementById("playerExp").textContent = gameData.experience;
    document.getElementById("nextLevelExp").textContent = gameData.level * 100;
    document.getElementById("playerCoins").textContent = gameData.coins;
    document.getElementById("freeSpins").textContent = gameData.freeSpins;
    
    // Update level unlocks
    for (let i = 1; i <= 5; i++) {
        const levelBox = document.getElementById("level" + i);
        if (gameData.unlockedLevels.includes(i)) {
            levelBox.classList.remove("locked");
        } else {
            levelBox.classList.add("locked");
        }
    }
    
    document.getElementById("characterPreview").src = "../assets/" + gameData.currentSkin + "_character.png";
}

// Select a level
function selectLevel(levelNum) {
    if (gameData.unlockedLevels.includes(levelNum)) {
        console.log("Starting level " + levelNum);
        window.location.href = "level" + levelNum + ".html";
    } else {
        alert("Level locked! Complete previous levels first.");
    }
}


// Add skin to selection
function addSkinToSelection(skinName) {
    const skinsGrid = document.querySelector('.skins-grid');
    const skinDiv = document.createElement('div');
    skinDiv.className = 'skin-option';
    skinDiv.onclick = function() { changeSkin(skinName); };
    
    skinDiv.innerHTML = `
        <img src="../assets/${skinName}_character.png" alt="${skinName} Skin">
        <h4>${skinName.charAt(0).toUpperCase() + skinName.slice(1)}</h4>
    `;
    
    skinsGrid.appendChild(skinDiv);
}

// Change character skin
function changeSkin(skinName) {
    if (gameData.ownedSkins.includes(skinName)) {
        gameData.currentSkin = skinName;
        saveGameData();
        
        // Update UI
        document.getElementById("characterPreview").src = "../assets/" + skinName + "_character.png";
        
        // Update selection highlight
        const skinOptions = document.querySelectorAll('.skin-option');
        skinOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.querySelector('h4').textContent.toLowerCase() === skinName.charAt(0).toUpperCase() + skinName.slice(1)) {
                option.classList.add('selected');
            }
        });
    }
}


// Initialize game
window.onload = function() {
    loadGameData();
    openMap(); // Start with map view
};


// Modal öffnen
function openModal() {
    document.getElementById("coinErrorModal").style.display = "block";
}

// Modal schließen
function closeModal() {
    document.getElementById("coinErrorModal").style.display = "none";
}

// Schließen des Modals beim Klick auf X
document.querySelector(".close-modal").addEventListener("click", closeModal);

// Schließen des Modals beim Klick außerhalb
window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("coinErrorModal")) {
        closeModal();
    }
});


function buySkin(skinName) {
    const skinPrices = {
        "warrior": 200,
        "mage": 300
    };
    
    if (gameData.coins >= skinPrices[skinName]) {
        gameData.coins -= skinPrices[skinName];
        gameData.ownedSkins.push(skinName);
        saveGameData();
        updateUI();
        alert("Skin purchased successfully!");
        
        // Add the skin to character page
        addSkinToSelection(skinName);
    } else {
        openModal();
    }
}


function spinWheel() {
    if (gameData.freeSpins > 0) {
        gameData.freeSpins--;
        
        // Hole das Rad-Element
        const wheelImg = document.querySelector(".lucky-wheel img");
        
        // Rad schneller drehen für Animation
        wheelImg.style.animation = "none"; // Animation zurücksetzen
        setTimeout(() => {
            wheelImg.style.animation = "rotate 0.5s linear infinite";
        }, 10);
        
        // Random prize
        const prizes = [
            { name: "10 Coins", value: 10, type: "coins" },
            { name: "50 Coins", value: 50, type: "coins" },
            { name: "100 Coins", value: 100, type: "coins" },
            { name: "Free Spin", value: 1, type: "spin" }
        ];
        
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        
        
        document.querySelector(".spin-btn").disabled = true;
        document.querySelector(".spin-btn").textContent = "Spinning...";
        
        setTimeout(() => {
            // Rad auf normale Geschwindigkeit zurücksetzen
            wheelImg.style.animation = "rotate 60s linear infinite";
            
            // Preis vergeben
            if (randomPrize.type === "coins") {
                gameData.coins += randomPrize.value;
                alert(`You won ${randomPrize.value} coins!`);
            } else if (randomPrize.type === "spin") {
                gameData.freeSpins += randomPrize.value;
                alert(`You won a free spin!`);
            }
            
            // UI und Button wiederherstellen
            saveGameData();
            updateUI();
            document.querySelector(".spin-btn").disabled = false;
            document.querySelector(".spin-btn").textContent = `Spin (Free: ${gameData.freeSpins})`;
        }, 2000);
    } else {
        alert("No free spins left! Complete levels to earn more spins.");
    }
}