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
  
    
    [name, birth, credit, nick].forEach(input => input.style.border = 'none');
  

    const missingFields = [];
  
    if (!name.value.trim()) missingFields.push(name);
    if (!birth.value.trim()) missingFields.push(birth);
    if (!credit.value.trim()) missingFields.push(credit);
    if (!nick.value.trim()) missingFields.push(nick);
  
    if (missingFields.length > 0) {
      missingFields.forEach(input => input.style.border = '2px solid red');

      document.getElementById('popupOverlay').style.display = 'flex';
      return; 
    }
  
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
  
    // Weiterleitung
    document.body.style.backgroundImage = "url('img/mapBackground.jpg')";
    document.body.style.backgroundSize = "cover";
    document.getElementById('charakterBox').style.display = 'none';
  
    window.location.href = "../html/map.html";
  };
  
  document.getElementById('closePopup').onclick = () => {
    document.getElementById('popupOverlay').style.display = 'none';
  };
  