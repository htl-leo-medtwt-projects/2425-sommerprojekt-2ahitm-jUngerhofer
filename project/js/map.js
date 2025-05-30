document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  
  function openShop() {
    playSound("click");
    document.getElementById("sigmaShop").style.display = "block";
    document.getElementById("sigmaMap").style.display = "none";
    document.getElementById("sigmaCharacter").style.display = "none";
    
    
    document.getElementById("shopBtn").classList.add("active");
    document.getElementById("mapBtn").classList.remove("active");
    document.getElementById("charBtn").classList.remove("active");
}

function openMap() {
    playSound("click");
    document.getElementById("sigmaShop").style.display = "none";
    document.getElementById("sigmaMap").style.display = "block";
    document.getElementById("sigmaCharacter").style.display = "none";
    
  
    document.getElementById("shopBtn").classList.remove("active");
    document.getElementById("mapBtn").classList.add("active");
    document.getElementById("charBtn").classList.remove("active");
}

function openCharacter() {
    playSound("click");
    document.getElementById("sigmaShop").style.display = "none";
    document.getElementById("sigmaMap").style.display = "none";
    document.getElementById("sigmaCharacter").style.display = "block";
    

    document.getElementById("shopBtn").classList.remove("active");
    document.getElementById("mapBtn").classList.remove("active");
    document.getElementById("charBtn").classList.add("active");
}

// Game data
let skibidi = JSON.parse(localStorage.getItem('playerData'));

console.log(skibidi);
console.log(skibidi.name)
let gameData = {
    playerName: skibidi.name,
    nickname: skibidi.nickname,
    level: 1,
    experience: 0,
    coins: 150,
    unlockedLevels: [1],
    ownedSkins: ["NoSkin"],
    currentSkin: "NoSkin",
    freeSpins: 1,
    creditCardNumber: skibidi.creditCardNumber, 
    soundOn: skibidi.soundOn
};

console.log(gameData);
document.getElementById("playerName").innerHTML = skibidi.nickname;



window.onload = function() {
    loadGameData();
    checkLevelProgress();
    updateUI();
    
    // Skins anzeigen
    gameData.ownedSkins.forEach(skin => {
        if (skin !== "NoSkin") {
            addSkinToSelection(skin);
        }
    });

    const hasSpun = localStorage.getItem('hasSpun');
    const spinButton = document.getElementById('spinButton');
    if (hasSpun && spinButton) {
      spinButton.disabled = true;
      spinButton.textContent = 'Bereits gedreht';
    }

    openMap(); // Map-Ansicht standardmäßig öffnen
};

// Load game data from localStorage if exists
function loadGameData() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
        gameData = JSON.parse(savedData);
        updateUI();
    }
}

// Save game data to localStorage new gameData
function saveGameData() {
    localStorage.setItem('gameData', JSON.stringify(gameData));
}


// Update UI with current game data
function updateUI() {
    // Spielerdaten anzeigen
    document.getElementById("playerName").textContent= skibidi.name;
    document.getElementById("playerLevel").textContent = gameData.level;
    document.getElementById("playerExp").textContent = gameData.experience;
    document.getElementById("nextLevelExp").textContent = gameData.level * 100;
    document.getElementById("playerCoins").textContent = gameData.coins;
    document.getElementById("freeSpins").textContent = gameData.freeSpins;
    // todo document.getElementById("creditCard").textContent = gameData.creditCardNumber;  
    //todo document.getElementById("soundStatus").textContent = gameData.soundOn ? "ON" : "OFF";

    
    // Update level unlocks
    for (let i = 1; i <= 5; i++) {
        const levelBox = document.getElementById("level" + i);
        if (gameData.unlockedLevels.includes(i)) {
            levelBox.classList.remove("locked");
            
            if (localStorage.getItem(`level${i}Completed`) === 'true') {
                levelBox.classList.add("completed");
                
                if (!levelBox.querySelector('.completed-icon')) {
                    const completedIcon = document.createElement('div');
                    completedIcon.className = 'completed-icon';
                    completedIcon.innerHTML = '✓';
                    levelBox.appendChild(completedIcon);
                }
            }
        } else {
            levelBox.classList.add("locked");
        }
    }
    
    const characterPreview = document.getElementById("characterPreview");
    if (characterPreview) {
        characterPreview.src = `../img/${gameData.currentSkin}/Run1.png`;
    }
}

// Select a level
function selectLevel(levelNum) {
    playSound("click");
    if (gameData.unlockedLevels.includes(levelNum)) {
        playSound("click");
        console.log("Starting level " + levelNum);
        window.location.href = "../game" + levelNum + "/game.html";
    } else {
        //alert("Level locked! Complete previous levels first."); box
        playSound("errorSound");
        openLevelModal();
    }
}


// Add skin to selection
function addSkinToSelection(skinName) {
    playSound("click");
    const skinsGrid = document.querySelector('.skins-grid');
    const skinDiv = document.createElement('div');
    skinDiv.className = 'skin-option';
    skinDiv.onclick = function() { changeSkin(skinName); };
    
    //todo richtiger pfad funktioniert noch nicht
    skinDiv.innerHTML = `
        <img src="../img/${skinName}/Run8.png" alt="${skinName} Skin">
        <h4>${skinName.charAt(0).toUpperCase() + skinName.slice(1)}</h4>
    `;
    
    skinsGrid.appendChild(skinDiv);
}

// Change character skin
function changeSkin(skinName) {
    playSound("click");
    if (gameData.ownedSkins.includes(skinName)) {
        gameData.currentSkin = skinName;
        saveGameData();
        
        // Update UI
        document.getElementById("characterPreview").src = "../img/" + skinName +"/Run8.png";
        
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


//fehlermeldung falls coins gering sind
function openModal() {
    document.getElementById("coinErrorModal").style.display = "block";
    playSound("errorSound");
}

// fehler schließen
function closeModal() {
    document.getElementById("coinErrorModal").style.display = "none";
}

//Unlocked Level
function openLevelModal() {
    document.getElementById("levelLockedModal").style.display = "block";
    playSound("errorSound");
}

function closeLevelModal() {
    document.getElementById("levelLockedModal").style.display = "none";
}

function openPrizeModal(message, title = "Gewinn!") {
    document.getElementById("prizeTitle").textContent = title;
    document.getElementById("prizeText").textContent = message;
    document.getElementById("prizeModal").style.display = "block";
    playSound("errorSound");
}

function closePrizeModal() {
    document.getElementById("prizeModal").style.display = "none";
}

function openPurchaseSuccessModal(message = "Skin wurde erfolgreich gekauft!") {
    document.getElementById("purchaseSuccessText").textContent = message;
    document.getElementById("purchaseSuccessModal").style.display = "block";
    playSound("succes"); 
}

function closePurchaseSuccessModal() {
    document.getElementById("purchaseSuccessModal").style.display = "none";
}




// Schließen des fehlers beim Klick auf X
document.querySelector(".close-modal").addEventListener("click", closeModal);

// Schließen der fehlermeldung beim Klick außerhalb
window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("coinErrorModal")) {
        closeModal();
    }
});

//TODO:  BOX LÖSCHEN done
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
        //alert("Skin purchased successfully!");
        playSound("click");
        if(skinName == "warrior"){
            document.getElementById("warrior").style.display = "none";
        }else{
            document.getElementById("mage").style.display = "none";
        }

        // Add the skin to character page
        addSkinToSelection(skinName);
    } else {
        //playSound("errorSound");
        openModal();
        playSound("errorSound");
    }
}


//funktioniert nicht

function spinWheel() {
    if (gameData.freeSpins > 0) {
        gameData.freeSpins--;
        window.location.href = "../html/wheel.html";
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
            { name: "200 Coins", value: 200, type: "coins" },
            { name: "3 Free Spin", value: 3, type: "spin" }
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
                //todo modal hinzufügen statt modal done
                openPrizeModal(`Du hast ${randomPrize.value} Münzen gewonnen!`);
            } else if (randomPrize.type === "spin") {
                gameData.freeSpins += randomPrize.value;
                //todo
                openPrizeModal("Du hast 3 Gratis-Drehungen gewonnen!");

            }
            
            // UI und Button wiederherstellen
            saveGameData();
            updateUI();
            document.querySelector(".spin-btn").disabled = false;
            document.querySelector(".spin-btn").textContent = `Spin (Free: ${gameData.freeSpins})`;
        }, 2000);
    } else {
        //todo
        openPrizeModal("Keine Gratis-Drehungen mehr! Schließe Level ab, um mehr zu bekommen.", "Hinweis");
    }
}

function checkLevelProgress() {
    // Prüfe, ob ein Level im localStorage als abgeschlossen markiert wurde
    for (let i = 1; i <= 5; i++) {
        if (localStorage.getItem(`level${i}Completed`) === 'true') {
            // Wenn das Level abgeschlossen wurde und noch nicht in unlockedLevels ist
            if (!gameData.unlockedLevels.includes(i)) {
                gameData.unlockedLevels.push(i);
            }
            
            if (i < 5 && !gameData.unlockedLevels.includes(i+1)) {
                gameData.unlockedLevels.push(i+1);
            }
        }
    }
    
    
    saveGameData();
    
    updateUI();
}

console.log("Available levels: ", gameData.unlockedLevels);


//löschen des spiels
function resetGame() {
    playSound("click");
    if (confirm("Bist du sicher, dass du den Spielstand löschen möchtest? Das kann nicht rückgängig gemacht werden.")) {
        localStorage.clear(); // Alles löschen
        window.location.href = '../main.html'; // Zurück zur Startseite
    }
}


function playSound(soundName) {
    const audio = new Audio(`../sounds/${soundName}.wav`);
    audio.volume = 0.8; // Lautstärke
    audio.play().catch(e => {
        console.warn("Sound konnte nicht abgespielt werden:", e);
    });
}
