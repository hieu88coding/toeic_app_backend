const puppeteer = require('puppeteer-extra')
const { setTimeout } = require("timers/promises");
const ExcelJS = require('exceljs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');


const audioFolderPath = 'D:/ToeicApp/audio/Test1';


fs.mkdirSync(audioFolderPath, { recursive: true });
// delay để trang tải hết các audio (nếu không bị giới hạn ở 15 audio)
async function scrollAndDelay(page, scrollDelay, waitTime) {
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    const middleHeight = Math.floor(pageHeight / 2);

    await page.evaluate((y) => {
        window.scrollTo(0, y);
    }, middleHeight);

    await setTimeout(waitTime);

    let currentHeight = await page.evaluate(() => window.innerHeight + window.scrollY);
    while (currentHeight < pageHeight) {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await setTimeout(scrollDelay);

        const newHeight = await page.evaluate(() => window.innerHeight + window.scrollY);
        if (newHeight === currentHeight) {
            break;
        }
        currentHeight = newHeight;
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
puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()

    await page.goto('https://estudyme.com/study/test/toeic-testpro/test-1-62b69492bbc57b27fe10f7ac/')
    await page.waitForSelector('.game-buttons.single-button button')
    await page.click('.game-buttons.single-button button');
    await navigationPromise
    const navItems = await page.$$('.game-toeic-rl-skills-nav-item');
    await navItems[1].click();
    await scrollAndDelay(page, 1000, 5000);
    const audioSrcs = await page.evaluate(() => Array.from(document.querySelectorAll('.react-audio-player'), element => element.src));
    console.log(audioSrcs.length);

    for (let i = 7; i < 32; i++) {
        const audioSrc = audioSrcs[i - 7];
        const audioName = `test1_audio_${i}.mp3`;
        downloadAndSaveAudio(audioSrc, audioName);
    }


    await browser.close();

})