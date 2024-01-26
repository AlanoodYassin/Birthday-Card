document.addEventListener('DOMContentLoaded', () => {
    // Request permission to access the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(handleMicAccess)
        .catch((error) => console.error('Error accessing microphone:', error));

    // Add event listener for the play button
    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', playBirthdaySong);
});

function handleMicAccess(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    // Connect the microphone to the analyser
    microphone.connect(analyser);

    // Set up the analyser
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Access the candle element and its flame
    const candle = document.getElementById('candle');
    const flame = document.getElementById('flame');

    // Threshold for sound intensity
    const threshold = 100;

    // Function to update flame based on sound input
    function updateFlame() {
        analyser.getByteTimeDomainData(dataArray);

    // Calculate the average amplitude
    const averageAmplitude = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

    // Log the average amplitude to the console
    console.log('Average Amplitude:', averageAmplitude);

    // Adjust flame height based on the average amplitude
    if (averageAmplitude > threshold) {
        const flameHeight = Math.min(100, averageAmplitude - threshold);
        flame.style.height = `${flameHeight}px`;
    } else {
        flame.style.height = '0px';  // No flame if below the threshold
    }

    // Schedule the next update
    requestAnimationFrame(updateFlame);
    }

    // Start updating the flame
    updateFlame();
}

// Function to play the birthday song
function playBirthdaySong() {
    const birthdaySong = document.getElementById('birthdaySong');
    birthdaySong.play();
}