function loadHowTo(){
    document.getElementById('container').style.display = 'none';
    document.getElementById('startGame').style.display = 'none';
    document.getElementById('howToPage').style.display = 'flex';

    document.body.style.backgroundImage = 'url(img/howToPlay.jpg)';
}


function closeHowTo(){
    document.getElementById('container').style.display = 'flex';
    document.getElementById('startGame').style.display = 'block';
    document.getElementById('howToPage').style.display = 'none';
    document.body.style.backgroundImage = 'url(img/StartingScreen.jpg)';
}
