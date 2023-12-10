const admin = require('firebase-admin');

function uploadAudio(audioPath) {
    const serviceAccount = require('./config/serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'hieu88toeicapp.appspot.com'
    });

    const bucket = admin.storage().bucket();
    const filename = audioPath.split('/').pop();
    const destination = `audios/${filename}`;

    return bucket.upload(audioPath, {
        destination: destination,
        metadata: {
            contentType: 'audio/mpeg'
        }
    })
        .then(() => {
            console.log('Đã tải audio lên Firebase Storage thành công!');
            return bucket.file(destination).getSignedUrl({
                action: 'read',
                expires: '03-09-2024'
            });
        })
        .then((signedUrls) => {
            const audioUrl = signedUrls[0];
            return audioUrl;
        })
        .catch(error => {
            console.error('Lỗi khi tải lên audio:', error);
            throw error;
        });
}

module.exports = {
    uploadAudio: uploadAudio
};