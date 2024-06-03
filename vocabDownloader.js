const ExcelJS = require('exceljs');
const axios = require('axios');
const fs = require('fs');
const puppeteer = require('puppeteer');
// Đường dẫn đến tệp Excel
const excelFilePath = 'D:/ToeicApp/Vocab/Job.xlsx';

(async () => {
    const browser = await puppeteer.launch({ headless: false });

    // Mở một trang mới
    const page = await browser.newPage();
    // Khởi tạo workbook
    const workbook = new ExcelJS.Workbook();

    // Đọc tệp Excel
    await workbook.xlsx.readFile(excelFilePath);

    // Lấy sheet đầu tiên
    const worksheet = workbook.getWorksheet(1);

    // Lặp qua hàng từ hàng 2
    for (let row = 2; row <= worksheet.rowCount; row++) {
        // Lấy giá trị từ cột số 2 (index 1)
        const wordRow = worksheet.getCell(row, 2).value;
        const keyword = wordRow.richText[0].text;
        const keywordWithoutN = keyword.replace(/\(n\)/gi, '').trim();
        if (keyword) {
            // Tạo URL tìm kiếm trên Google Images
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keywordWithoutN)}&tbm=isch`;

            try {
                await page.goto(searchUrl);

                // Đợi cho trang tìm kiếm tải hoàn tất
                await page.waitForSelector('img[src]');
                // Gửi yêu cầu tìm kiếm Google Images
                //const response = await axios.get(searchUrl);
                const imageUrl = await page.evaluate(() => {
                    const firstImage = document.querySelector('img[src]');
                    return firstImage ? firstImage.getAttribute('src') : null;
                });

                if (imageUrl) {
                    console.log(imageUrl);
                    const imageResponse = await page.goto(imageUrl);
                    if (imageResponse.ok()) {
                        const imageBuffer = await imageResponse.buffer();
                        console.log('troll');
                        // fs.writeFileSync(`D:/ToeicApp/Vocab/Job/${keywordWithoutN}.jpg`, imageBuffer);
                        // console.log(`Downloaded image for "${keywordWithoutN}"`);
                    } else {
                        console.log(`Failed to download image for "${keywordWithoutN}". Response status: ${imageResponse.status()}`);
                    }
                } else {
                    console.log(`No image found for "${keyword}"`);
                }
            } catch (error) {
                console.error(`Error searching image for "${keyword}":`, error);
            }
        }
    }
})();
