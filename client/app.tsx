const imageUpload: HTMLInputElement | null = document.getElementById('imageUpload') as HTMLInputElement
const faceapi = (window as any).faceapi as any

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
  ]).then(start)

  async function start() {
    const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)
    let image: HTMLImageElement
    let canvas: HTMLCanvasElement
    document.body.append('Loaded')
    if(imageUpload) imageUpload.addEventListener('change', async () => {
          console.log(imageUpload.files)
        if (image) image.remove()
      if (canvas) canvas.remove()
  
      image = await faceapi.bufferToImage(imageUpload.files ? imageUpload.files[0]: new Blob())
      container.append(image)
      canvas = faceapi.createCanvasFromMedia(image)
      container.append(canvas)
      const displaySize = { width: image.width, height: image.height }
      faceapi.matchDimensions(canvas, displaySize)
      const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      resizedDetections.forEach((_: any, i: number) => {
        const box = resizedDetections[i].detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: (i + 1).toString() })
        drawBox.draw(canvas)
      })
    })
  }

//   createRoot(document.getElementById("root"))