let videoStream;
var divCamera = document.querySelector(".divCamera");
var divBtnAtivarCamera = document.querySelector(".divBtnAtivarCamera");
var video = document.querySelector(".videoFoto");
var FotoEPreview = document.querySelector(".FotoEPreview");
var ListaImagens = document.querySelector(".listaImagens");
var listLenght = ListaImagens.childElementCount
var canvasFotos = document.querySelectorAll(".containerCanvas")


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

function actionClickContCanvas (event) {
    console.log("--- actionClickContCanvas ---")
    var canvasFoto = event.target;
    console.log("canvasFoto: ",canvasFoto)
}

document.querySelector(".buttonFoto").addEventListener("click", () => {
    var canvas = document.createElement('canvas');
    var ContainerCanvas = document.createElement('div');

    var delFoto = document.createElement('div');
    var saveFoto = document.createElement('div');

    var delFotoIcon = document.createElement('img');
    var saveFotoIcon = document.createElement('img');
    
    delFotoIcon.src = './img/delete.png'
    saveFotoIcon.src = './img/download.png'

    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    
    canvas.className = 'canvasFoto'
    ContainerCanvas.className = 'containerCanvas'
    
    delFoto.className = 'del-icon'
    delFoto.appendChild(delFotoIcon);
    
    saveFoto.className = 'save-icon'
    saveFoto.appendChild(saveFotoIcon);
    
    var newContext = canvas.getContext('2d');
    newContext.drawImage(video, 0, 0);

    ContainerCanvas.appendChild(delFoto);
    ContainerCanvas.appendChild(saveFoto);
    ContainerCanvas.appendChild(canvas);
    // link.textContent = 'Clique para baixar a imagem';
    ListaImagens.appendChild(ContainerCanvas);

    var link = document.createElement('a');
    link.download = 'foto.png';
    link.href = canvas.toDataURL();

    // console.log("toDataURL(): ", link.href)

    link.textContent = 'baixar a imagem';
    // link.appendChild(canvas);

    FotoEPreview.appendChild(link);
    // ListaImagens.appendChild(link);

    
    canvasFotos = document.querySelectorAll(".containerCanvas")
    // console.log(canvasFotos)
    

    for (var i = 0; i < canvasFotos.length; i++) {
        canvasFotos[i].addEventListener('click', actionClickContCanvas);
    }
});

document.querySelector(".btnDesativarCamera").addEventListener("click", () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    
    divCamera.style.display = 'none'
    divBtnAtivarCamera.style.display = 'block'
});
