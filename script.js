const typeWriterSound = new Audio('sound/sound.mp3');
const lines = [
    "Embark on a unique journey through the intricate pathways of the mind.",
    "Here, in a world shaped by notes and thoughts, you'll play a symphony of emotions.",
    "Each key you press not only creates music but also brings to life the fleeting thoughts that often go unnoticed.",
    "As you navigate this melodic maze, you'll discover the art of balancing harmony and chaos.",
    "Are you ready to experience the ebb and flow of the mind's ocean?"
];
let currentLine = 0;
let index = 0;
const speed = 38;

document.getElementById('start-experience').addEventListener('click', function() {
    this.style.display = 'none';
    document.getElementById('title').classList.remove('hidden');
    typeText();
});

function playSound() {
    typeWriterSound.play().catch(e => console.error("Error playing sound:", e));
}

function typeText() {
    if (currentLine < lines.length) {
        if (index < lines[currentLine].length) {
            if (index === 0 && currentLine === 0) {
                playSound();
            }
            document.getElementById("dynamic-text").classList.remove('hidden');
            document.getElementById("dynamic-text").innerHTML += lines[currentLine].charAt(index);
            index++;
            setTimeout(typeText, speed);
        } else {
            document.getElementById("dynamic-text").innerHTML += '<br><br>';
            index = 0;
            currentLine++;
            setTimeout(typeText, speed);
        }
    } else {
        typeWriterSound.pause();
        typeWriterSound.currentTime = 0;
        document.getElementById("start-journey").classList.remove('hidden');
        document.getElementById("start-journey").addEventListener('click', function() {
            window.location.href = 'piano-page/index.html';
        });
    }
}
