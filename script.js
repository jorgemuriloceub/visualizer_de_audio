const audio = document.getElementById("audio");
const fileInput = document.getElementById("audioFile");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioContext;
let analyser;
let dataArray;

let particles = [];

fileInput.onchange = function () {
    const files = this.files;
    audio.src = URL.createObjectURL(files[0]);

    if (!audioContext) {
        audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();

        analyser.fftSize = 2048; 
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }

    audio.play();
};

// Partículas 
class Particle {
    constructor(x, y, speed, size, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
        this.color = color;
        this.alpha = 1;
    }
    update() {
        this.y -= this.speed;
        this.alpha -= 0.01;
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // barras circulares
    const radius = 180;
    const bars = 180;

    for (let i = 0; i < bars; i++) {
        const angle = (i * Math.PI * 2) / bars;
        const value = dataArray[i] / 255;

        const barHeight = value * 300;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;

        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        ctx.strokeStyle = `hsl(${i * 2}, 100%, 50%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // criar partículas 
        if (barHeight > 120 && Math.random() > 0.8) {
            particles.push(new Particle(
                x2,
                y2,
                Math.random() * 2 + 1,
                Math.random() * 4 + 2,
                ctx.strokeStyle
            ));
        }
    }

    // partículas
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    // onda central 
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0ff";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#0ff";

    for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i] / 255;
        const x = (i / dataArray.length) * canvas.width;
        const y = centerY + value * 150 * Math.sin(i * 0.05);

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
}

animate();

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

