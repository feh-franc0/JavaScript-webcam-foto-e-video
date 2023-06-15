var video = document.querySelector(".videoFoto");

// * Ativação da câmera
document.addEventListener('DOMContentLoaded', function() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoStream = stream;
      video.srcObject = stream;
      video.play();
    })
    .catch((error) => {
      console.log(error);
    });
});

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
    // Obtém acesso à câmera usando a função getUserMedia do objeto navigator.mediaDevices
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
        // Atribui o objeto de stream retornado à propriedade srcObject do elemento de vídeo
        videoElement.srcObject = stream;

        // Cria um novo objeto MediaRecorder e o associa ao objeto de stream
        mediaRecorder = new MediaRecorder(stream);

        // Variável para armazenar o tempo restante
        remainingTime = 0;

        // Define um evento ondataavailable para capturar os dados gravados pelo MediaRecorder
        mediaRecorder.ondataavailable = function (e) {
          console.log(e.data)
          chunks.push(e.data);
        };

        // Define um evento onstop para ser executado quando a gravação for interrompida
        mediaRecorder.onstop = function () {
          // Cria um objeto Blob a partir dos chunks de dados gravados, especificando o tipo do arquivo (webm no caso)
          videoData = new Blob(chunks, { type: 'video/webm' });

          // Limpa o array de chunks para a próxima gravação
          chunks = [];

          // Remove o objeto de stream do elemento de vídeo
          videoElement.srcObject = null;

          // Atribui a URL do Blob ao elemento de vídeo usado para reproduzir o vídeo gravado
          recordedVideoElement.src = URL.createObjectURL(videoData);

          // Habilita os controles de reprodução do vídeo gravado
          recordedVideoElement.controls = true;
        };

        // Inicia a gravação
        mediaRecorder.start();

        // Configura um intervalo de 1 segundo para atualizar o tempo restante
        countdown = setInterval(updateTimer, 1000);

        // Desabilita o botão de iniciar a gravação
        startButton.disabled = true;

        // Habilita o botão de parar a gravação
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
