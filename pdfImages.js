const pdfjs = require('pdfjs-dist');
const admin = require('firebase-admin');
const { createCanvas } = require('canvas');
const axios = require('axios');


async function handlePdf(pdfPath, testName) {
    const serviceAccount = require('./config/serviceAccountKey.json');
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: 'hieu88toeicapp.appspot.com'
        });
    }

    const bucket = admin.storage().bucket();
    const folderPath = `${testName}`;

    //tai ve truoc khi up len
    const buffer = await axios.get(pdfPath, { responseType: 'arraybuffer' }).then(response => response.data);

    return pdfjs.getDocument(buffer).promise
        .then(pdf => {
            const numPages = pdf.numPages;
            const promises = [];

            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                promises.push(
                    pdf.getPage(pageNumber)
                        .then(page => {
                            const viewport = page.getViewport({ scale: 2.0 });
                            const canvas = createCanvas(viewport.width, viewport.height);
                            const context = canvas.getContext('2d');
                            return page.render({
                                canvasContext: context,
                                viewport: viewport
                            }).promise.then(() => canvas.toDataURL('image/png'));
                        })
                        .then(imageData => {
                            const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
                            const filename = `image_${pageNumber}.png`;
                            const filepath = `${folderPath}/` + filename;
                            const file = bucket.file(filepath);

                            return new Promise((resolve, reject) => {
                                const stream = file.createWriteStream({
                                    metadata: {
                                        contentType: 'image/png'
                                    }
                                });

                                stream.on('error', reject);
                                stream.on('finish', () => {
                                    const destination = `${bucket.name}/${file.name}`;
                                    resolve(destination);
                                });

                                stream.end(Buffer.from(base64Data, 'base64'));
                            });
                        })
                );
            }

            return Promise.all(promises);
        })
        .then(() => {
            console.log('Đã tải lên Firebase Storage thành công!');
            return bucket.file(folderPath).getSignedUrl({
                action: 'read',
                expires: '03-09-2024' // Thời gian hết hạn của URL
            }).then(signedUrls => {
                const downloadUrls = signedUrls[0];
                return downloadUrls;
            });
        })
        .catch(error => {
            console.error('Lỗi khi trích xuất ảnh:', error);
            throw error;
        });
}

module.exports = handlePdf;
