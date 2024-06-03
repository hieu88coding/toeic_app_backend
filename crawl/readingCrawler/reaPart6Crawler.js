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



// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

// That's it, the rest is puppeteer usage as normal 😊


puppeteer.launch({
    headless: false
}).then(async browser => {
    async function runMultipleTests(numTests) {
        for (let i = 3; i <= numTests; i++) {
            let page = await browser.newPage()
            let navigationPromise = page.waitForNavigation()
            await page.goto(`https://estudyme.com/study/toeic-testpro/part-6-text-completion/test-${i}/`)
            await navigationPromise
            await setTimeout(5000)
            let navItems = await page.$$('.question-segment-palette-scroll-container .question-segment-grid .question-segment-item');
            for (let i = 0; i < 4; i++) {
                await navItems[i]?.click();
                let answerIcon = await page.$$('.quiz-choice-item-icon ');
                for (let index = 0; index < answerIcon.length; index += 4) {
                    await answerIcon[index].click();
                }

            }
            let submit = await page.$$(' #main-study-view #game-view-container #main-game-play-section .game-object-view-container .child-game-nav-container button');
            console.log(submit.length);
            await submit[0].click();
            await navigationPromise
            await scrollAndDelay(page, 1000, 5000);
            let explanation = await page.evaluate(() => Array.from(document.querySelectorAll('#main-study-view #main-game-review-section .game-object-explanation.quiz-explanation .game-object-explanation-content'), element => element.innerHTML));
            let rightAnswer = await page.evaluate(() => Array.from(document.querySelectorAll('.quiz-choice-item-content:not(.not-selected):not(.incorrect)'), element => element.innerHTML));

            //let transcript = await page.evaluate(() => Array.from(document.querySelectorAll('#main-game-review-section .box-game-para .game-object-question-explanation-para '), element => element.innerHTML));
            let question = await page.evaluate(() => Array.from(document.querySelectorAll('.game-object-quiz .question-index-wrap .game-object-question-text'), element => element.innerHTML));
            let answers = await page.evaluate(() => Array.from(document.querySelectorAll('.quiz-choice-item-content'), element => element.innerHTML));
            let para = await page.evaluate(() => Array.from(document.querySelectorAll('#main-study-view #main-game-review-section .game-object-view-aio.game-para-aio-with-content .game-object-view-container .game-object-view .game-object-question.question-para:not(#main-study-view #main-game-review-section .game-object-view-aio.game-para-aio-with-content .game-object-view-container .game-object-view .game-object-question.question-para.no-content)'), element => element.innerHTML));
            console.log(para.length);
            console.log(explanation.length);
            console.log(rightAnswer.length);
            console.log(question.length);
            console.log(answers.length);
            //Create a new workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.columns = [
                { header: 'Số thứ tự', key: 'index', width: 10 },
                { header: 'Đáp án đúng', key: 'rightAnswer', width: 70 },
                { header: 'Giải thích', key: 'explanation', width: 70 },
                { header: 'Transcript', key: 'transcript', width: 70 },
            ];

            for (let i = 0; i < 16; i++) {
                const row = worksheet.addRow({
                    index: i + 1,
                    rightAnswer: rightAnswer[i] || '',
                    explanation: explanation[i],
                    transcript: ''
                });
            }
            //Save workbook to Excel file
            await workbook.xlsx.writeFile(`D:/ToeicApp/answer/Part6/Part6_Test${i}_answer.xlsx`);


            const newWorkbook = new ExcelJS.Workbook();
            const newWorksheet = newWorkbook.addWorksheet('Data2');

            newWorksheet.columns = [
                { header: 'Số thứ tự', key: 'index', width: 10 },
                { header: 'Đề bài', key: 'para', width: 70 },
                { header: 'Đáp án A', key: 'answerA', width: 30 },
                { header: 'Đáp án B', key: 'answerB', width: 30 },
                { header: 'Đáp án C', key: 'answerC', width: 30 },
                { header: 'Đáp án D', key: 'answerD', width: 30 },
            ];

            let indexCount = 1; // Biến đếm câu hỏi

            for (let i = 0; i < 4; i++) {
                const paraIndex = i;
                const questionIndex = i * 4;

                const rowPara = newWorksheet.addRow({
                    index: indexCount,
                    para: para[paraIndex] || '',
                    answerA: answers[questionIndex * 4] || '',
                    answerB: answers[questionIndex * 4 + 1] || '',
                    answerC: answers[questionIndex * 4 + 2] || '',
                    answerD: answers[questionIndex * 4 + 3] || '',
                });

                for (let j = 1; j <= 3; j++) {
                    const currentIndex = indexCount + j;
                    const rowQuestion = newWorksheet.addRow({
                        index: currentIndex,
                        para: '',  // Để trống cột para cho các câu hỏi liên quan
                        answerA: answers[(questionIndex + j) * 4] || '',
                        answerB: answers[(questionIndex + j) * 4 + 1] || '',
                        answerC: answers[(questionIndex + j) * 4 + 2] || '',
                        answerD: answers[(questionIndex + j) * 4 + 3] || '',
                    });
                }

                indexCount += 4; // Tăng indexCount sau khi hoàn thành mỗi nhóm 4 câu hỏi
            }

            //Save workbook to Excel file
            await newWorkbook.xlsx.writeFile(`D:/ToeicApp/Exel/Part6/Part6_Test${i}_question.xlsx`);
        }

    }
    await runMultipleTests(10);
    await browser.close();
})
