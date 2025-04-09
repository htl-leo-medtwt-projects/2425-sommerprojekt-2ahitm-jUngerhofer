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


//function getData
document.getElementById('nextBtn').onclick = () => {
    const name = document.getElementById('fullname');
    const birth = document.getElementById('birthdate');
    const credit = document.getElementById('cc');
    const nick = document.getElementById('nickname');
  
    // Reset der Styles (alte Fehler entfernen)
    [name, birth, credit, nick].forEach(input => input.style.border = 'none');
  
    // Leere Felder erfassen
    const missingFields = [];
  
    if (!name.value.trim()) missingFields.push(name);
    if (!birth.value.trim()) missingFields.push(birth);
    if (!credit.value.trim()) missingFields.push(credit);
    if (!nick.value.trim()) missingFields.push(nick);
  
    if (missingFields.length > 0) {
      // Markiere fehlende Felder rot
      missingFields.forEach(input => input.style.border = '2px solid red');
  
      // Zeige Popup mit Warnung
      document.getElementById('popupOverlay').style.display = 'flex';
      return; // Stoppe, nichts abspeichern!
    }
  
    // ✅ Alles ausgefüllt → Daten erfassen
    let data = {
      name: name.value,
      birthdate: birth.value,
      creditCard: credit.value,
      nickname: nick.value,
      offers: offerOn,
      sound: soundOn,
      value: document.getElementById('slider').value,
      coins,
      level,
      dailyUsed
    };
  
    localStorage.setItem('playerData', JSON.stringify(data));
  
    // Weiterleitung vorbereiten
    document.body.style.backgroundImage = "url('img/mapBackground.jpg')";
    document.body.style.backgroundSize = "cover";
    document.getElementById('charakterBox').style.display = 'none';
  
    window.location.href = "html/map.html";
  };
  
  document.getElementById('closePopup').onclick = () => {
    document.getElementById('popupOverlay').style.display = 'none';
  };
  