const puppeteer = require('puppeteer-extra')
const { setTimeout } = require("timers/promises");
const ExcelJS = require('exceljs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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


// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

// That's it, the rest is puppeteer usage as normal 😊
puppeteer.launch({ headless: false }).then(async browser => {
    async function runMultipleTests(numTests) {
        for (let i = 13; i <= numTests; i++) {
            let audioFolderPath = `D:/ToeicApp/audio/Part2/Test${i}`;
            let page = await browser.newPage()
            let navigationPromise = page.waitForNavigation()
            await page.goto(`https://estudyme.com/study/toeic-testpro/part-2-question-response/test-${i}/`)
            await navigationPromise
            await setTimeout(5000)
            let navItems = await page.$$('.question-segment-palette-scroll-container .question-segment-grid .question-segment-item-btn-wrap button');
            for (let i = 0; i < 25; i++) {
                await navItems[i]?.click();
                let audioSrcs = await page.$$eval('audio', audios => audios.map(audio => audio.src));
                let audioName = `part2_test${i}_audio_${i + 1}_${i + 3}.mp3`;
                await downloadAndSaveAudio(audioSrcs[0], audioName, audioFolderPath);
                let answerIcon = await page.$$('.quiz-choice-item-icon ');
                await answerIcon[0].click();
            }
            let submit = await page.$$(' #main-study-view #game-view-container #main-game-play-section .game-object-view-container .child-game-nav-container button');
            console.log(submit.length);
            await submit[0].click();
            await navigationPromise
            await scrollAndDelay(page, 1000, 5000);
            let explanation = await page.evaluate(() => Array.from(document.querySelectorAll('#main-study-view #main-game-review-section .game-object-explanation.quiz-explanation .game-object-explanation-content'), element => element.innerHTML));
            let rightAnswer = await page.evaluate(() => Array.from(document.querySelectorAll('.quiz-choice-item-content:not(.not-selected):not(.incorrect)'), element => element.innerHTML));

            //let transcript = await page.evaluate(() => Array.from(document.querySelectorAll('#main-game-review-section .box-game-para .game-object-question-explanation-para '), element => element.innerHTML));
            //let question = await page.evaluate(() => Array.from(document.querySelectorAll('.game-object-quiz .question-index-wrap .game-object-question-text'), element => element.innerHTML));
            //let answers = await page.evaluate(() => Array.from(document.querySelectorAll('.quiz-choice-item-content'), element => element.innerHTML));

            //Create a new workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.columns = [
                { header: 'Số thứ tự', key: 'index', width: 10 },
                { header: 'Đáp án đúng', key: 'rightAnswer', width: 70 },
                { header: 'Giải thích', key: 'explanation', width: 70 },
                { header: 'Transcript', key: 'transcript', width: 70 },
            ];

            for (let i = 0; i < 25; i++) {
                const row = worksheet.addRow({
                    index: i + 1,
                    rightAnswer: rightAnswer[i] || '',
                    explanation: explanation[i] || '',
                    transcript: ''
                });
            }
            //Save workbook to Excel file
            await workbook.xlsx.writeFile(`D:/ToeicApp/answer/Part2/Part2_Test${i}_answer.xlsx`);
            //nhớ để ý test nào đủ 25 câu mới crawl

        }

    }
    await runMultipleTests(14);

    await browser.close();

})