let videoStream;
var divCamera = document.querySelector(".divCamera");
var divBtnAtivarCamera = document.querySelector(".divBtnAtivarCamera");
var video = document.querySelector(".videoFoto");
var FotoEPreview = document.querySelector(".FotoEPreview");
var ListaImagens = document.querySelector(".listaImagens");


document.querySelector(".btnAtivarCamera").addEventListener("click", () => {
    divCamera.style.display = 'block'
    divBtnAtivarCamera.style.display = 'none'

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

document.querySelector(".buttonFoto").addEventListener("click", () => {
    var canvas = document.createElement('canvas');

    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.className = 'canvasFoto'
    var newContext = canvas.getContext('2d');
    newContext.drawImage(video, 0, 0);

    ListaImagens.appendChild(canvas);

    var link = document.createElement('a');
    link.download = 'foto.png';
    link.href = canvas.toDataURL();

    // link.textContent = 'Clique para baixar a imagem';
    link.appendChild(canvas);

    // FotoEPreview.appendChild(link);
    ListaImagens.appendChild(link);
});


document.querySelector(".btnDesativarCamera").addEventListener("click", () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    
    divCamera.style.display = 'none'
    divBtnAtivarCamera.style.display = 'block'
});
