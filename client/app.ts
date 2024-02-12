type processedImage = {
  image: HTMLImageElement,
  boxes: any[]
}

const uploadButton: HTMLLabelElement = document.getElementById('upload-plus-icon') as HTMLLabelElement
const mainsection: HTMLDivElement = document.getElementById('main-section') as HTMLDivElement
const imageUpload: HTMLInputElement = document.getElementById('image-upload') as HTMLInputElement
const galleryBar: HTMLDivElement = document.getElementById('gallery-bar') as HTMLDivElement
const faceapi = (window as any).faceapi as any

const images: processedImage[] = []

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  uploadButton.style.display = "block"
  imageUpload.style.display = "none"
}

async function onUploadImage() {
  if (!imageUpload) return;
  appendImageToMain(null);

  const image = await faceapi.bufferToImage(imageUpload.files ? imageUpload.files[0] : new Blob())
  const displaySize = { width: image.width, height: image.height }
  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
  const resizedDetections = faceapi.resizeResults(detections, displaySize)

  images.unshift({
    image,
    boxes: resizedDetections
  })

  updateGalleryBar()
  appendImageToMain(images[0])
}

function appendImageToMain(picture: processedImage | null) {
  mainsection?.replaceChildren()
  if(!picture){
    mainsection?.append("...Processing")
    return 
  }
  let canvas: HTMLCanvasElement = faceapi.createCanvasFromMedia(picture.image)
  const displaySize = { width: picture.image.width, height: picture.image.height }
  faceapi.matchDimensions(canvas, displaySize)
  mainsection?.appendChild(picture.image.cloneNode())
  mainsection?.appendChild(canvas)
  picture.boxes.forEach((element: any, i: number) => {
    const box = element.detection.box
    const drawBox = new faceapi.draw.DrawBox(box, { label: (i + 1).toString() })
    drawBox.draw(canvas)
  })
}

function updateGalleryBar() {
  galleryBar.replaceChildren(galleryBar.childNodes[0], galleryBar.childNodes[1])

  for (let picture of images) {
    const imageClone = picture.image.cloneNode()
    imageClone.addEventListener("click", () => appendImageToMain(picture))
    galleryBar.append(imageClone, picture.boxes.length.toString())
  }
}

imageUpload.addEventListener('change', onUploadImage)
