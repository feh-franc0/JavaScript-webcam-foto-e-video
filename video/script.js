// Verifica se o navegador suporta a API da mídia
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Configurações da gravação
  const constraints = { video: true, audio: true };

  // Elementos HTML
  const videoElement = document.getElementById('video-preview');
  const timerElement = document.getElementById('timer');
  const startButton = document.getElementById('start-button');
  const stopButton = document.getElementById('stop-button');
  const recordedVideoElement = document.getElementById('recorded-video');

  let mediaRecorder;
  let remainingTime;
  let chunks = [];
  let countdown;
  let videoData;

  // Formatar segundo para minuto
  function segundosParaMinutos(segundos) {
    var minutos = Math.floor(segundos / 60); // Obtém a parte inteira dos minutos
    var segundosRestantes = segundos % 60; // Obtém os segundos restantes
  
    var minutosFormatados = minutos.toString().padStart(2, '0'); // Formata os minutos com 2 dígitos, adicionando zero à esquerda se necessário
    var segundosFormatados = segundosRestantes.toString().padStart(2, '0'); // Formata os segundos com 2 dígitos, adicionando zero à esquerda se necessário
  
    return minutosFormatados + ':' + segundosFormatados;
  }

  // Atualiza o temporizador
  function updateTimer() {
    console.log('remainingTime: ',  remainingTime)
    stopRecordingIfTimeLimit()
    timerElement.textContent = segundosParaMinutos(remainingTime);
    remainingTime++
  }

  // Inicia a gravação
  function startRecording() {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
        videoElement.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);
        remainingTime = 0

        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = function () {
          videoData = new Blob(chunks, { type: 'video/webm' });
          chunks = [];
          videoElement.srcObject = null;
          recordedVideoElement.src = URL.createObjectURL(videoData);
          recordedVideoElement.controls = true;
        };

        mediaRecorder.start();
        countdown = setInterval(updateTimer, 1000);
        startButton.disabled = true;
        stopButton.disabled = false;
      })
      .catch(function (error) {
        console.error('Erro ao acessar a câmera: ', error);
      });
  }

  // Para a gravação
  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      clearInterval(countdown);
      timerElement.textContent = '0';
      remainingTime = 0
      startButton.disabled = false;
      stopButton.disabled = true;
    }
  }

  // Parar  gravacao com 120 segundos de video
  function stopRecordingIfTimeLimit() {
    if (remainingTime === 120) {
      mediaRecorder.stop();
      clearInterval(countdown);
      timerElement.textContent = '0';
      remainingTime = 0
      startButton.disabled = false;
      stopButton.disabled = true;
    }
  }

  // Event listeners dos botões
  startButton.addEventListener('click', startRecording);
  stopButton.addEventListener('click', stopRecording);
} else {
  console.error('O navegador não suporta a API de mídia necessária.');
}
