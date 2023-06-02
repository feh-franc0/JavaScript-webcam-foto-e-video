var video = document.querySelector("#video");
var startRecord = document.querySelector("#startRecord");
var stopRecord = document.querySelector("#stopRecord");
var downloadLink = document.querySelector("#downloadLink");

window.onload = async function () {
  stopRecord.style.display = "none";

  videoStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  video.srcObject = videoStream;
  video.muted = true
};

startRecord.onclick = function () {
  console.log('startRecord')
  startRecord.style.display = "none";
  stopRecord.style.display = "inline";

  mediaRecorder = new MediaRecorder(videoStream);

  let blob = [];

  mediaRecorder.addEventListener("dataavailable", function (e) {
    blob.push(e.data);
  });

  mediaRecorder.addEventListener("stop", function () {
    var videoLocal = URL.createObjectURL(new Blob(blob));
    downloadLink.href = videoLocal;
  });

  mediaRecorder.start();
};

// * --- / / ---

stopRecord.onclick = function () {
  console.log('stopRecord')
  mediaRecorder.stop();
};
