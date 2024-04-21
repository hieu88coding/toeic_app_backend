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
    const navItems = await page.$$('.game-toeic-rl-skills-nav-item');
    await navItems[6].click();
    await scrollAndDelay(page, 1000, 5000);
    const question = await page.evaluate(() => Array.from(document.querySelectorAll('.game-object-quiz .question-index-wrap .game-object-question-text'), element => element.innerHTML));
    const answers = await page.evaluate(() => Array.from(document.querySelectorAll('.quiz-choice-item-content'), element => element.innerHTML));
    const para = await page.evaluate(() => Array.from(document.querySelectorAll('.content-para-scroll .game-object-question-text'), element => element.innerHTML));
    //console.log(para[0]);
    console.log(question.length);
    console.log(answers.length);
    //Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.columns = [
        { header: 'Số thứ tự', key: 'index', width: 10 },
        { header: 'Đề bài', key: 'para', width: 70 },
        { header: 'Câu hỏi', key: 'question', width: 70 },
        { header: 'Đáp án A', key: 'answerA', width: 30 },
        { header: 'Đáp án B', key: 'answerB', width: 30 },
        { header: 'Đáp án C', key: 'answerC', width: 30 },
        { header: 'Đáp án D', key: 'answerD', width: 30 },
    ];
    // 0- 0123 1-4567 2-891011
    let questionCount = 0;//2 4
    let indexCount = 147;//149 151
    let paraIndex = 0;//1 2
    function crawlSinglelParagragh(spaceNumber) {
        const rowPara = worksheet.addRow({
            index: indexCount,
            question: question[questionCount] || '',
            para: para[paraIndex] || '',
            answerA: answers[questionCount * 4] || '',
            answerB: answers[questionCount * 4 + 1] || '',
            answerC: answers[questionCount * 4 + 2] || '',
            answerD: answers[questionCount * 4 + 3] || '',
        });

        for (let j = 1; j <= spaceNumber; j++) {
            let currentIndex = indexCount + j;
            let currentQuestionIndex = questionCount + j;
            const rowQuestion = worksheet.addRow({
                index: currentIndex,
                question: question[currentQuestionIndex] || '',
                para: '',  // Để trống cột para cho các câu hỏi liên quan
                answerA: answers[(questionCount + j) * 4] || '',
                answerB: answers[(questionCount + j) * 4 + 1] || '',
                answerC: answers[(questionCount + j) * 4 + 2] || '',
                answerD: answers[(questionCount + j) * 4 + 3] || '',
            });
        }

        indexCount += (spaceNumber + 1);
        questionCount += (spaceNumber + 1);
        paraIndex++;
    }
    crawlSinglelParagragh(1);//147-148
    crawlSinglelParagragh(1);//149-150
    crawlSinglelParagragh(2);//151-153
    crawlSinglelParagragh(1);//154-155
    crawlSinglelParagragh(2);//156-158
    crawlSinglelParagragh(2);//159-161
    crawlSinglelParagragh(3);//162-165
    crawlSinglelParagragh(2);//166-168
    crawlSinglelParagragh(2);//169-171
    crawlSinglelParagragh(3);//172-175
    crawlSinglelParagragh(4);//176-180
    crawlSinglelParagragh(4);//181-185
    crawlSinglelParagragh(4);//186-190
    crawlSinglelParagragh(4);//191-195
    crawlSinglelParagragh(4);//196-200
    //Save workbook to Excel file
    await workbook.xlsx.writeFile('D:/ToeicApp/Exel/Test1/part7.xlsx');

    await browser.close();

})