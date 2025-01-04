const synth = window.speechSynthesis;
let utterance;
let voices = [];
let currentWordIndex = 0;
let words = [];

function loadVoices() {
    voices = synth.getVoices();
    const voiceSelect = document.getElementById("voice-select");
    voiceSelect.innerHTML = "";
    
    voices.forEach((voice, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

synth.onvoiceschanged = loadVoices;

function speakText() {
    const text = document.getElementById("text-input").value;

    if (!text.trim()) {
        alert("Please enter some text to speak!");
        return;
    }

    words = text.split(" ");
    currentWordIndex = 0;

    utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[document.getElementById("voice-select").value];
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    document.getElementById("status").textContent = "Status: Speaking...";
    updateProgressBar(0);
    highlightWord(currentWordIndex);

    utterance.onboundary = (event) => {
        if (event.name === "word") {
            currentWordIndex++;
            highlightWord(currentWordIndex);
            updateProgressBar((currentWordIndex / words.length) * 100);
        }
    };

    utterance.onend = () => {
        document.getElementById("status").textContent = "Status: Finished";
        updateProgressBar(100);
        clearHighlight();
    };

    utterance.onpause = () => {
        document.getElementById("status").textContent = "Status: Paused";
    };

    utterance.onresume = () => {
        document.getElementById("status").textContent = "Status: Speaking...";
    };

    synth.speak(utterance);
}

function stop() {
    synth.cancel();
    document.getElementById("status").textContent = "Status: Stopped";
    updateProgressBar(0);
    clearHighlight();
}

function pause() {
    synth.pause();
}

function resume() {
    synth.resume();
}

function previewVoice() {
    const voiceIndex = document.getElementById("voice-select").value;
    const previewText = "This is a preview of the selected voice.";
    
    const previewUtterance = new SpeechSynthesisUtterance(previewText);
    previewUtterance.voice = voices[voiceIndex];
    synth.speak(previewUtterance);
}

function updateProgressBar(percentage) {
    const progressBar = document.getElementById("progress");
    progressBar.style.width = percentage + "%";
}

function highlightWord(index) {
    const textOutput = document.getElementById("text-output");
    textOutput.innerHTML = words
        .map((word, i) => 
            i === index ? `<span class="highlight">${word}</span>` : word
        )
        .join(" ");
}

function clearHighlight() {
    const textOutput = document.getElementById("text-output");
    textOutput.innerHTML = words.join(" ");
}
