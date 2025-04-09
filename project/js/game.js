let coins = 0;
let level = 0;
let dailyUsed = false;
let offerOn = false;
let soundOn = false;

document.getElementById('offersToggle').onclick = () => {
  offerOn = !offerOn;
  document.getElementById('offersToggle').innerText = offerOn ? "On" : "Off";
};

document.getElementById('soundToggle').onclick = () => {
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? "On" : "Off";
};

document.getElementById('slider').oninput = (e) => {
  document.getElementById('sliderVal').innerText = e.target.value;
};

document.getElementById('nextBtn').onclick = () => {
  let data = {
    name: document.getElementById('fullname').value,
    birthdate: document.getElementById('birthdate').value,
    creditCard: document.getElementById('cc').value,
    nickname: document.getElementById('nickname').value,
    offers: offerOn,
    sound: soundOn,
    value: document.getElementById('slider').value,
    coins,
    level,
    dailyUsed
  };

  localStorage.setItem('playerData', JSON.stringify(data)); // optional: speichern

  console.log(data);
  
  // Hintergrund ändern
  document.body.style.backgroundImage = "url('img/mapBackground.jpg')";
  document.body.style.backgroundSize = "cover";

  // Box ausblenden
  document.getElementById('charakterBox').style.display = 'none';

  // Map laden (ersetz das mit deiner Seite/Code)
  window.location.href = "html/map.html";
};
