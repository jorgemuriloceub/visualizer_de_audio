let audioContext;
let analyser;
let source;
let audio;
let isPlaying = false;

const fileInput = document.getElementById("audioFile");
const playBtn = document.getElementById("playBtn");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 400;

// Quando arquivo é selecionado
fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        audio = new Audio(URL.createObjectURL(file));
        audio.crossOrigin = "anonymous";
    }
});

// Botão de play
playBtn.addEventListener("click", function () {
    if (!audio) {
        alert("Selecione um arquivo de áudio primeiro!");
        return;
    }

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }

    if (!isPlaying) {
        audio.play();
        animate();
        playBtn.innerText = "⏸ Pausar";
    } else {
        audio.pause();
        playBtn.innerText = "▶ Reproduzir";
    }

    isPlaying = !isPlaying;
});

// Animação do visualizador
function animate() {
    requestAnimationFrame(animate);

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) - 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i] * 1.5;

        ctx.fillStyle = `rgb(${barHeight + 20}, 0, 120)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
    }
}
