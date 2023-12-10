const admin = require('firebase-admin');

function handleAnswer(jsonFilePath) {
    const serviceAccount = require('./config/serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'hieu88toeicapp.appspot.com'
    });

    const bucket = admin.storage().bucket();
    const filename = jsonFilePath.split('/').pop();
    const destination = `jsons/${filename}`;

    return bucket.upload(jsonFilePath, {
        destination: destination,
        metadata: {
            contentType: 'application/json'
        }
    })
        .then(() => {
            console.log('Đã tải file đáp án lên Firebase Storage thành công!');
            return bucket.file(destination).getSignedUrl({
                action: 'read',
                expires: '03-09-2024'
            });
        })
        .then((signedUrls) => {
            const jsonUrl = signedUrls[0];
            return jsonUrl;
        })
        .catch(error => {
            console.error('Lỗi khi tải lên tệp JSON:', error);
            throw error;
        });
}

module.exports = {
    handleAnswer: handleAnswer
};