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
const uploadButton = document.getElementById('upload-plus-icon');
const mainsection = document.getElementById('main-section');
const imageUpload = document.getElementById('image-upload');
const galleryBar = document.getElementById('gallery-bar');
const faceapi = window.faceapi;
const images = [];
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        uploadButton.style.display = "block";
        imageUpload.style.display = "none";
    });
}
function onUploadImage() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!imageUpload)
            return;
        const image = yield faceapi.bufferToImage(imageUpload.files ? imageUpload.files[0] : new Blob());
        const displaySize = { width: image.width, height: image.height };
        const detections = yield faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        images.unshift({
            image,
            boxes: resizedDetections
        });
        updateGalleryBar();
        appendImageToMain(images[images.length - 1]);
    });
}
function appendImageToMain(picture) {
    mainsection === null || mainsection === void 0 ? void 0 : mainsection.replaceChildren();
    let canvas = faceapi.createCanvasFromMedia(picture.image);
    const displaySize = { width: picture.image.width, height: picture.image.height };
    faceapi.matchDimensions(canvas, displaySize);
    mainsection === null || mainsection === void 0 ? void 0 : mainsection.appendChild(picture.image.cloneNode());
    mainsection === null || mainsection === void 0 ? void 0 : mainsection.appendChild(canvas);
    picture.boxes.forEach((element, i) => {
        const box = element.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: (i + 1).toString() });
        drawBox.draw(canvas);
    });
}
function updateGalleryBar() {
    galleryBar.replaceChildren(galleryBar.childNodes[0], galleryBar.childNodes[1]);
    for (let picture of images) {
        const imageClone = picture.image.cloneNode();
        imageClone.addEventListener("click", () => appendImageToMain(picture));
        galleryBar.appendChild(imageClone);
    }
}
imageUpload.addEventListener('change', onUploadImage);
