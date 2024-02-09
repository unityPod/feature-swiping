"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const imageUpload = document.getElementById('imageUpload');
const faceapi = window.faceapi;
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.createElement('div');
        container.style.position = 'relative';
        document.body.append(container);
        let image;
        let canvas;
        document.body.append('Loaded');
        if (imageUpload)
            imageUpload.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                console.log(imageUpload.files);
                if (image)
                    image.remove();
                if (canvas)
                    canvas.remove();
                image = yield faceapi.bufferToImage(imageUpload.files ? imageUpload.files[0] : new Blob());
                container.append(image);
                canvas = faceapi.createCanvasFromMedia(image);
                container.append(canvas);
                const displaySize = { width: image.width, height: image.height };
                faceapi.matchDimensions(canvas, displaySize);
                const detections = yield faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                resizedDetections.forEach((_, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box, { label: (i + 1).toString() });
                    drawBox.draw(canvas);
                });
            }));
    });
}
//   createRoot(document.getElementById("root"))
