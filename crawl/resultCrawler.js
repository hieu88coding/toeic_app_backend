const puppeteer = require('puppeteer-extra')
const { setTimeout } = require("timers/promises");
const ExcelJS = require('exceljs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');




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
    const navItems = await page.$$('.question-palette-footer .question-palette-function-buttons .button-submit-game');
    //console.log(navItems);
    await navItems[0].click();
    const confirm = await page.$$(' .submit-game-confirm-modal .submit-game-confirm-modal-actions button');
    //console.log(confirm);
    await confirm[1].click();
    await navigationPromise
    await scrollAndDelay(page, 1000, 10000);
    const explanation = await page.evaluate(() => Array.from(document.querySelectorAll('#main-study-view #main-game-review-section .game-object-explanation.quiz-explanation .game-object-explanation-content'), element => element.innerHTML));
    console.log(explanation.length);
    const transcript = await page.evaluate(() => Array.from(document.querySelectorAll('#main-game-review-section .box-game-para .game-object-question-explanation-para '), element => element.innerHTML));
    console.log(transcript.length);
    const rightAnswer = await page.evaluate(() => Array.from(document.querySelectorAll('.quiz-choice-item-content:not(.not-selected)'), element => element.innerHTML));

    //Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.columns = [
        { header: 'Số thứ tự', key: 'index', width: 10 },
        { header: 'Đáp án đúng', key: 'rightAnswer', width: 70 },
        { header: 'Giải thích', key: 'explanation', width: 70 },
        { header: 'Transcript', key: 'transcript', width: 70 },
    ];

    for (let i = 0; i < 31; i++) {
        const row = worksheet.addRow({
            index: i + 1,
            rightAnswer: rightAnswer[i] || '',
            explanation: explanation[i] || '',
            transcript: ''
        });
    }
    for (let i = 32; i < 101; i++) {
        const row = worksheet.addRow({
            index: i,
            rightAnswer: rightAnswer[i - 1] || '',
            explanation: '',
            transcript: transcript[Math.floor((i - 32) / 3)]
        });
    }
    for (let i = 101; i < 201; i++) {
        const row = worksheet.addRow({
            index: i,
            rightAnswer: rightAnswer[i - 1] || '',
            explanation: explanation[i - 70] || '',
            transcript: ''
        });
    }

    //Save workbook to Excel file
    await workbook.xlsx.writeFile('D:/ToeicApp/answer/Test1_answer.xlsx');

    await browser.close();

})