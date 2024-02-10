type processedImage = {
  image: HTMLImageElement,
  boxes: any[]
}

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
  imageUpload.style.display = "block"
}

async function onUploadImage() {
  if(!imageUpload) return;

  const image = await faceapi.bufferToImage(imageUpload.files ? imageUpload.files[0] : new Blob())
  const displaySize = { width: image.width, height: image.height }
  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
  const resizedDetections = faceapi.resizeResults(detections, displaySize)
  
  images.unshift({
    image,
    boxes: resizedDetections
  })

}