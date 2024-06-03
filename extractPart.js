const axios = require('axios');
const admin = require('firebase-admin');
const JSZip = require('jszip');

const serviceAccount = require('./config/serviceAccountKey.json');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'hieu88toeicapp.appspot.com'
    });
}

const bucket = admin.storage().bucket();

async function unzipAndUploadToFirebase(category, url, type, testName, partTitle) {
    try {
        // Lấy đường link tải về từ Firebase
        const firebaseDownloadUrl = url;

        // Tải tệp tin ZIP từ đường dẫn Firebase
        const response = await axios.get(firebaseDownloadUrl, { responseType: 'arraybuffer' });
        const zipData = response.data;

        // Giải nén tệp tin ZIP
        const zip = new JSZip();
        const zipFiles = await zip.loadAsync(zipData);

        // Lặp qua các tệp tin con đã giải nén
        for (const [fileName, file] of Object.entries(zipFiles.files)) {
            if (!file.dir) {
                // Tạo luồng đọc từ tệp tin con
                const fileData = await file.async('nodebuffer');

                // Tạo đường dẫn lưu trữ trên Firebase
                const firebaseFilePath = `${category}/${type}/${partTitle}/${testName}/extractedFile/${fileName}`;

                // Tải lên tệp tin con lên Firebase Storage
                await bucket.file(firebaseFilePath).save(fileData);
            }
        }
        const folderUrl = `https://console.firebase.google.com/project/hieu88toeicapp/storage/hieu88toeicapp.appspot.com/files/~2F${category}~2F${type}~2F${partTitle}~2FextractedFile~2F${testName}`;
        console.log('Các tệp tin đã được giải nén và tải lên Firebase thành công!');
        return folderUrl;


    } catch (error) {
        console.error('Lỗi khi giải nén và tải lên Firebase:', error);
    }
}

// Gọi hàm giải nén và tải lên Firebase
module.exports = unzipAndUploadToFirebase;