let pianoKeys = [];
let whiteKeyWidth, blackKeyWidth, whiteKeyHeight, blackKeyHeight;
let osc, keyPressCount = 0, userText = '', movingRectangles = [], keyPressThreshold = 10;
let headerHeight, notesWidth;

function setup() {
    headerHeight = document.querySelector('header').offsetHeight;
    notesWidth = document.getElementById('notes-section').offsetWidth;
    let cnv = createCanvas(windowWidth, windowHeight - headerHeight);
    cnv.position(notesWidth, headerHeight);

    osc = new p5.Oscillator('sine');
    osc.amp(0.5);
    whiteKeyWidth = (width) / 52;
    whiteKeyHeight = height / 4;
    blackKeyWidth = whiteKeyWidth / 2;
    blackKeyHeight = whiteKeyHeight / 2;

    createPianoKeys();
}

function draw() {
    background(255);
    drawPianoKeys();
    movingRectangles.forEach(rect => rect.moveAndDisplay());
}

function mousePressed() {
    for (let i = movingRectangles.length - 1; i >= 0; i--) {
        if (movingRectangles[i].isClicked(mouseX, mouseY)) {
            movingRectangles.splice(i, 1);
            return;
        }
    }

    let keyPressed = false;
    pianoKeys.forEach(key => {
        if (key.isPressed(mouseX, mouseY)) {
            key.playNote();
            key.changeColor('lightgrey');
            keyPressed = true;
            keyPressCount++;
            if (keyPressCount >= keyPressThreshold) {
                userText = window.prompt("Write a thought or worry in 2-3 words:");
                keyPressCount = 0;
                if (userText) {
                    movingRectangles.push(new MovingRectangle(userText));
                }
            }
        }
    });

    if (!keyPressed) {
        osc.stop();
    }
}

function mouseReleased() {
    osc.stop();
    pianoKeys.forEach(key => key.resetColor());
}

function createPianoKeys() {
    let blackKeys = [1, 3, 6, 8, 10];
    let octave = 12;
    let totalWhiteKeys = 52;

    for (let i = 0; i < totalWhiteKeys; i++) {
        let x = i * whiteKeyWidth;
        let y = height - whiteKeyHeight;
        pianoKeys.push(new PianoKey(x, y, whiteKeyWidth, whiteKeyHeight, 'white', midiToFreq(21 + i)));
    }

    for (let i = 0; i < totalWhiteKeys; i++) {
        if (blackKeys.includes(i % octave)) {
            let x = (i + 0.7) * whiteKeyWidth;
            let y = height - blackKeyHeight;
            pianoKeys.push(new PianoKey(x, y, blackKeyWidth, blackKeyHeight, 'black', midiToFreq(21 + i + 1)));
        }
    }
}

function drawPianoKeys() {
    pianoKeys.forEach(key => key.draw());
}

class PianoKey {
    constructor(x, y, width, height, type, freq) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.freq = freq;
        this.color = this.type === 'black' ? 'black' : 'white';
    }

    draw() {
        fill(this.color);
        stroke(0);
        rect(this.x, this.y, this.width, this.height);
    }

    isPressed(mx, my) {
        return mx > this.x && mx < this.x + this.width && my > this.y && my < this.y + this.height;
    }

    playNote() {
        osc.freq(this.freq);
        osc.start();
    }

    changeColor(newColor) {
        this.color = newColor;
    }

    resetColor() {
        this.color = this.type === 'black' ? 'black' : 'white';
    }
}

class MovingRectangle {
    constructor(text) {
        this.x = random(width - notesWidth);
        this.y = random(headerHeight, height - whiteKeyHeight - 150);
        this.w = random(50, 150);
        this.h = random(50, 150);
        this.text = text;
        this.dx = random(-2, 2);
        this.dy = random(-2, 2);
    }

    moveAndDisplay() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > width - this.w - notesWidth) this.dx *= -1;
        if (this.y < headerHeight || this.y > height - this.h - whiteKeyHeight - 150) this.dy *= -1;

        fill(random(255), random(255), random(255), 50);
        noStroke();
        rect(this.x, this.y, this.w, this.h);

        fill(0);
        textSize(16);
        text(this.text, this.x + 10, this.y + 20, this.w - 20, this.h - 20);
    }

    isClicked(mx, my) {
        return mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h;
    }
}

function windowResized() {
    headerHeight = document.querySelector('header').offsetHeight;
    notesWidth = document.getElementById('notes-section').offsetWidth;
    let cnv = createCanvas(windowWidth - notesWidth, windowHeight - headerHeight);
    cnv.position(notesWidth, headerHeight);

    whiteKeyWidth = (width - notesWidth) / 52;
    whiteKeyHeight = height / 4;
    blackKeyWidth = whiteKeyWidth / 2;
    blackKeyHeight = whiteKeyHeight / 2;
    
    pianoKeys = [];
    createPianoKeys();
}
