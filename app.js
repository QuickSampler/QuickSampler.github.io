URL = window.URL || window.webkitURL;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext
var isRecording;
var input;
var recorder;
var mixButton = document.getElementById("mixButton");
mixButton.addEventListener("click", startRecording);

function startRecording() {
    mixButton.removeEventListener("click", startRecording);
    mixButton.addEventListener("click", stopRecording);
    mixButton.value = "Stop";

    var constraints = { audio: true }

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        audioContext = new AudioContext();
        isRecording = stream;
        input = audioContext.createMediaStreamSource(stream);
        recorder = new Recorder(input, { numChannels: 1 })
        recorder.record()
    }).catch(function (err) {
        location.reload();
    });
}

function stopRecording() {
    mixButton.removeEventListener("click", stopRecording);
    mixButton.addEventListener("click", startRecording);
    mixButton.value = "Record";
    recorder.stop();
    isRecording.getAudioTracks()[0].stop();
    recorder.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    var filename = new Date().toISOString();
    link.href = url;
    link.download = filename + ".wav";
    link.click();
    window.URL.revokeObjectURL(url);
}