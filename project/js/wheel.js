const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');

const segments = [
  { label: '10 Münzen', type: 'coins', value: 10 },
  { label: '50 Münzen', type: 'coins', value: 50 },
  { label: '5 Münzen', type: 'coins', value: 100 },
  { label: '1 Gratis-Dreh', type: 'spin', value: 1 },
  { label: '3 Gratis-Drehs', type: 'spin', value: 3 },
  { label: '100 Münzen', type: 'coins', value: 200 }
];

let gameData = JSON.parse(localStorage.getItem('gameData')) || {
    coins: 0,
    freeSpins: 0
  };
  

const segmentCount = segments.length;
const anglePerSegment = (2 * Math.PI) / segmentCount;
let startAngle = 0;
let isSpinning = false;



function drawWheel() {
  for (let i = 0; i < segmentCount; i++) {
    const angle = startAngle + i * anglePerSegment;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 200, angle, angle + anglePerSegment);
    ctx.fillStyle = `hsl(${(i * 360) / segmentCount}, 100%, 50%)`;
    ctx.fill();
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle + anglePerSegment / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(segments[i].label, 180, 10);
    ctx.restore();
  }
  // Zeichne den Zeiger
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(250, 50);
  ctx.lineTo(240, 70);
  ctx.lineTo(260, 70);
  ctx.closePath();
  ctx.fill();

  if (gameData.freeSpins < 0) {
    setTimeout(() => {
      window.location.href = '../html/map.html';
    }, 2000);
  }
}

function spinWheel() {
    if (isSpinning || gameData.freeSpins < 0) return;
  
    //gameData.freeSpins -= 1;
    localStorage.setItem('gameData', JSON.stringify(gameData));
  
    isSpinning = true;
    const spinAngle = Math.random() * 360 + 720;
    const duration = 4000;
    const start = performance.now();
  
    function animate(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const angle = spinAngle * easeOutCubic(progress);
      startAngle = (angle * Math.PI) / 180;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWheel();
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        determinePrize(angle % 360);
      }
    }
  
    requestAnimationFrame(animate);
  }
  
  

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function determinePrize(degrees) {
    const index = Math.floor((360 - degrees) / (360 / segmentCount)) % segmentCount;
    const prize = segments[index];
    alert(`Du hast ${prize.label} gewonnen!`);
    updateGameData(prize);
    localStorage.setItem('hasSpun', 'true');
  }
  


function updateGameData(prize) {
    if (prize.type === 'coins') {
      gameData.coins += prize.value;
    } else if (prize.type === 'spin') {
      gameData.freeSpins += prize.value;
    }
  
    localStorage.setItem('gameData', JSON.stringify(gameData));

    setTimeout(() => {
      window.location.href = '../html/map.html';
    }, 3000);
  }
  
  
  

drawWheel();
spinButton.addEventListener('click', spinWheel);
