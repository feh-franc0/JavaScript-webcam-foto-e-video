let videoStream;
var divCamera = document.querySelector(".divCamera");
var divBtnAtivarCamera = document.querySelector(".divBtnAtivarCamera");
var video = document.querySelector(".videoFoto");
var FotoEPreview = document.querySelector(".FotoEPreview");
var ListaImagens = document.querySelector(".listaImagens");
var canvasFotos = document.querySelectorAll(".containerCanvas");

//* Criação do array vazio
let arrayObjetos = [];

let num = 0;

// ? Ativa a camera
document.querySelector(".btnAtivarCamera").addEventListener("click", () => {
  divCamera.style.display = "block";
  divBtnAtivarCamera.style.display = "none";

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

//* Função para remover um item pelo valor da chave
function removerItem(chave) {
  // Filtra o array em busca do objeto com a chave fornecida
  arrayObjetos = arrayObjetos.filter((objeto) => !objeto.hasOwnProperty(chave));
}

document.querySelector(".closePreviewImage").addEventListener("click", () => {
  document.querySelector(".videoFoto").style.display = "block";
  document.querySelector(".previewData").style.display = "none";
});

// ? ao clicar na imagem:
function actionClickContCanvas(event) {
  console.log("--- actionClickContCanvas ---");
  var canvasFoto = event.target;
  console.log("database: ", canvasFoto.toDataURL());

  let classAndKey = canvasFoto.className.split(" ");
  console.log(classAndKey);

  if (classAndKey[0] === "canvasFoto") {
    let canvasPreview = document.querySelector(".previewImagemPicture");
    let ctx = canvasPreview.getContext("2d");

    let image = new Image();
    image.src = canvasFoto.toDataURL();

    image.onload = function () {
      canvasPreview.width = video.videoWidth;
      canvasPreview.height = video.videoHeight;
      ctx.drawImage(image, 0, 0);
    };

    document.querySelector(".videoFoto").style.display = "none";
    document.querySelector(".previewData").style.display = "block";
    // canvasPreview.style.display = "block"
  }

  if (classAndKey[0] === "delete") {
    //! Deleta elemento.
    document
      .querySelector(`.${classAndKey[1]}`)
      .parentElement.parentElement.remove();

    removerItem(classAndKey[1]);
    console.log(arrayObjetos);
  } else {
    console.log("elemento nao reconhecido");
  }

  // console.log(arrayObjetos);
}

//* Função para adicionar um objeto com chave e valor ao array
function adicionarItem(chave, valor) {
  // Criação do objeto
  let objeto = {};
  objeto[chave] = valor;

  // Adiciona o objeto ao array
  arrayObjetos.push(objeto);
}

// ? cria as imagens de preview de cada imagem e seus botoes de actions
document.querySelector(".buttonFoto").addEventListener("click", () => {
  var canvas = document.createElement("canvas");
  var ContainerCanvas = document.createElement("div");

  var delFoto = document.createElement("div");
  var saveFoto = document.createElement("div");

  var delFotoIcon = document.createElement("img");
  var saveFotoIcon = document.createElement("img");

  delFotoIcon.src = "./img/delete.png";
  // let valueEl = ListaImagens.childElementCount
  let valueEl = num;
  num++;
  console.log("valueEl: ", valueEl);
  delFotoIcon.className = `delete delete${valueEl}`;

  saveFotoIcon.src = "./img/download.png";

  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;

  canvas.className = "canvasFoto";
  ContainerCanvas.className = "containerCanvas";

  delFoto.className = "del-icon";
  delFoto.appendChild(delFotoIcon);

  saveFoto.className = "save-icon";
  saveFoto.appendChild(saveFotoIcon);

  console.log("video: ", video);
  var newContext = canvas.getContext("2d");
  newContext.drawImage(video, 0, 0);

  // link.textContent = 'Clique para baixar a imagem';

  var link = document.createElement("a");
  link.download = "foto.png";
  link.href = canvas.toDataURL();

  // console.log("toDataURL(): ", link.href)

  // link.textContent = 'baixar a imagem';
  // link.appendChild(canvas);
  link.appendChild(saveFoto);

  // FotoEPreview.appendChild(link);
  // ListaImagens.appendChild(link);

  ContainerCanvas.appendChild(delFoto);
  ContainerCanvas.appendChild(link);
  ContainerCanvas.appendChild(canvas);
  ListaImagens.appendChild(ContainerCanvas);

  let chave = `delete${valueEl}`;

  // console.log(`chave: ${chave} & valor: ${canvas.toDataURL()}`)
  adicionarItem(chave, canvas.toDataURL());
  console.log(arrayObjetos);

  canvasFotos = document.querySelectorAll(".containerCanvas");
  // console.log(canvasFotos)

  for (var i = 0; i < canvasFotos.length; i++) {
    canvasFotos[i].addEventListener("click", actionClickContCanvas);
  }
});

// ? Desativar camera
document.querySelector(".btnDesativarCamera").addEventListener("click", () => {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }

  divCamera.style.display = "none";
  divBtnAtivarCamera.style.display = "block";
});

// TODO: objeto adicionar & remover

// // Adiciona alguns itens ao array
// adicionarItem("chave1", "valor1");
// adicionarItem("chave2", "valor2");
// adicionarItem("chave3", "valor3");

// console.log(arrayObjetos); // Exibe o array de objetos

// // Remove um item pelo valor da chave
// removerItem("chave2");

// console.log(arrayObjetos); // Exibe o array de objetos atualizado
