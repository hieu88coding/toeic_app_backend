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
puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://estudyme.com/study/toeic-testpro/part-7-single-passages/test-10/')
    await navigationPromise
    await setTimeout(5000)
    const stackCount = [];
    let navItems = await page.$$('.question-segment-palette-scroll-container .question-segment-grid .question-segment-item');
    for (let i = 0; i < 10; i++) {
        await navItems[i]?.click();
        let answerIcon = await page.$$('.quiz-choice-item-icon ');
        stackCount.push(answerIcon.length / 4 - 1);
        for (let index = 0; index < answerIcon.length; index += 4) {
            await answerIcon[index].click();
        }

    }
    let submit = await page.$$(' #main-study-view #game-view-container #main-game-play-section .game-object-view-container .child-game-nav-container button');
    console.log(submit.length);
    await submit[0].click();
    await navigationPromise
    await setTimeout(2000)
    await scrollAndDelay(page, 1000, 5000);
    let explanation = await page.evaluate(() => Array.from(document.querySelectorAll('#main-study-view #main-game-review-section .game-object-explanation.quiz-explanation .game-object-explanation-content'), element => element.innerHTML));
    let rightAnswer = await page.evaluate(() => Array.from(document.querySelectorAll('.quiz-choice-item-content:not(.not-selected):not(.incorrect)'), element => element.innerHTML));

    //let transcript = await page.evaluate(() => Array.from(document.querySelectorAll('#main-game-review-section .box-game-para .game-object-question-explanation-para '), element => element.innerHTML));
    const question = await page.evaluate(() => Array.from(document.querySelectorAll('.game-object-quiz .question-index-wrap .game-object-question-text'), element => element.innerHTML));
    const answers = await page.evaluate(() => Array.from(document.querySelectorAll('.quiz-choice-item-content'), element => element.innerHTML));
    const para = await page.evaluate(() => Array.from(document.querySelectorAll('#main-study-view #main-game-review-section .game-object-view-aio.game-para-aio-with-content .game-object-view-container .game-object-view .game-object-question.question-para:not(#main-study-view #main-game-review-section .game-object-view-aio.game-para-aio-with-content .game-object-view-container .game-object-view .game-object-question.question-para.no-content)'), element => element.innerHTML));
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

    for (let i = 0; i < 29; i++) {
        const row = worksheet.addRow({
            index: i + 1,
            rightAnswer: rightAnswer[i] || '',
            explanation: explanation[i],
            transcript: ''
        });
    }
    //Save workbook to Excel file
    await workbook.xlsx.writeFile('D:/ToeicApp/answer/Part71/Part71_Test10_answer.xlsx');


    const newWorkbook = new ExcelJS.Workbook();
    const newWorksheet = newWorkbook.addWorksheet('Data2');

    newWorksheet.columns = [
        { header: 'Số thứ tự', key: 'index', width: 10 },
        { header: 'Đề bài', key: 'para', width: 70 },
        { header: 'Câu hỏi', key: 'question', width: 70 },
        { header: 'Đáp án A', key: 'answerA', width: 30 },
        { header: 'Đáp án B', key: 'answerB', width: 30 },
        { header: 'Đáp án C', key: 'answerC', width: 30 },
        { header: 'Đáp án D', key: 'answerD', width: 30 },
    ];

    let questionCount = 0;
    let indexCount = 1;
    let paraIndex = 0;
    function crawlSinglelParagragh(spaceNumber) {
        const rowPara = newWorksheet.addRow({
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
            const rowQuestion = newWorksheet.addRow({
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
    for (let index = 0; index < stackCount.length; index++) {
        crawlSinglelParagragh(stackCount[index])
    }
    // Tạo mảng tạm để lưu trữ các câu hỏi và các đề bài
    // Sắp xếp mảng indexDistances theo khoảng cách tăng dần
    const indexDistances = [];

    // Duyệt qua từng hàng trong newWorksheet
    newWorksheet.eachRow((row, rowNumber) => {
        const paraValue = row.getCell('para').value;
        // Kiểm tra nếu cột "para" không trống
        if (paraValue.length !== 0 && paraValue !== 'Đề bài') {
            indexDistances.push(row.getCell('index').value);
        }
    });
    const resultSort = [];
    for (let i = 0; i < indexDistances.length - 1; ++i) {
        const currentValue = parseInt(indexDistances[i]);
        const nextValue = parseInt(indexDistances[i + 1]);
        resultSort.push({ index: currentValue, distance: nextValue - currentValue });
    }
    console.log(resultSort);
    const tempSort = resultSort[resultSort.length - 1].index + resultSort[resultSort.length - 1].distance;
    resultSort.push({ index: tempSort, distance: 30 - tempSort });

    resultSort.sort((a, b) => a.distance - b.distance);
    console.log(resultSort);
    // Tạo một mảng mới để lưu trữ các hàng đã được sắp xếp
    const sortedRows = [];

    // Duyệt qua từng phần tử trong mảng indexDistances
    resultSort.forEach((info) => {
        // Lấy các hàng từ startIndex đến endIndex và thêm vào mảng sortedRows
        for (let i = 0; i < info.distance; i++) {
            sortedRows.push(newWorksheet.getRow(info.index + i + 1));
        }
    });

    // Xóa tất cả các hàng trong newWorksheet
    for (let i = newWorksheet.rowCount; i > 1; i--) {
        newWorksheet.spliceRows(i, 1);
    }

    // Thêm các hàng đã được sắp xếp vào newWorksheet
    sortedRows.forEach((row) => {
        newWorksheet.addRow(row.values);
    });

    newWorksheet.getColumn('index').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
            cell.value = rowNumber - 1;
        }
    });
    //Save workbook to Excel file
    await newWorkbook.xlsx.writeFile('D:/ToeicApp/Exel/Part71/Part71_Test10_question.xlsx');


    await browser.close();

})