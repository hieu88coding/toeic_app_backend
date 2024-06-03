const puppeteer = require('puppeteer-extra')
const { setTimeout } = require("timers/promises");
const ExcelJS = require('exceljs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadAndSaveAudio(url, filename, audioFolderPath) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const audioData = response.data;

        const filePath = path.join(audioFolderPath, filename);
        fs.writeFileSync(filePath, audioData);

        console.log(`Đã tải xuống và lưu audio thành công: ${filePath}`);
    } catch (error) {
        console.error('Lỗi khi tải xuống audio:', error.message);
    }
}

// Hàm tải xuống và lưu ảnh
async function downloadAndSaveImage(url, filename, imageFolderPath) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageData = response.data;

        const filePath = path.join(imageFolderPath, filename);
        fs.writeFileSync(filePath, imageData);

        console.log(`Đã tải xuống và lưu ảnh thành công: ${filePath}`);
    } catch (error) {
        console.error('Lỗi khi tải xuống ảnh:', error.message);
    }
}


async function scrapePart1(i) {
    let audioFolderPath = `D:/ToeicApp/audio/Test${i}`;
    let imageFolderPath = `D:/ToeicApp/images/Test${i}`;
    let imageSrcs = await page.$$eval('.game-image-widget-backdrop-preview img', images => images.map(img => img.src));;
    let imageName = `test${i}_img_${i}.jpg`;
    downloadAndSaveImage(imageSrcs, imageName, imageFolderPath);
    let audioSrcs = await page.$$eval('audio', audios => audios.map(audio => audio.src));
    let audioName = `test${i}_audio_${i}.mp3`;
    await downloadAndSaveAudio(audioSrcs[0], audioName, audioFolderPath);
}
module.exports = scrapePart1;


