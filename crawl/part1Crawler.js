const puppeteer = require('puppeteer-extra')
const { setTimeout } = require("timers/promises");
const ExcelJS = require('exceljs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục chứa ảnh và audio
const imageFolderPath = 'D:/ToeicApp/images/Test1';
const audioFolderPath = 'D:/ToeicApp/audio/Test1';

// Tạo thư mục nếu chưa tồn tại
fs.mkdirSync(imageFolderPath, { recursive: true });
fs.mkdirSync(audioFolderPath, { recursive: true });

// Hàm tải xuống và lưu ảnh
async function downloadAndSaveImage(url, filename) {
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

// Hàm tải xuống và lưu audio
async function downloadAndSaveAudio(url, filename) {
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


// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

// That's it, the rest is puppeteer usage as normal 😊
puppeteer.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()

    await page.goto('https://estudyme.com/study/test/toeic-testpro/test-1-62b69492bbc57b27fe10f7ac/')
    await page.waitForSelector('.game-buttons.single-button button')
    await page.click('.game-buttons.single-button button');
    await navigationPromise
    const audioSrcs = await page.$$eval('audio', audios => audios.map(audio => audio.src));
    const imageSrcs = await page.$$eval('.game-image-widget-backdrop-preview img', images => images.map(img => img.src));
    const rowCount = Math.max(audioSrcs.length, imageSrcs.length);
    for (let i = 0; i < rowCount; i++) {
        const imageSrc = imageSrcs[i];
        const audioSrc = audioSrcs[i];

        if (imageSrc) {
            const imageName = `test1_img_${i + 1}.jpg`;
            downloadAndSaveImage(imageSrc, imageName);
        }

        if (audioSrc) {
            const audioName = `test1_audio_${i + 1}.mp3`;
            downloadAndSaveAudio(audioSrc, audioName);
        }
    }


    await browser.close();

})