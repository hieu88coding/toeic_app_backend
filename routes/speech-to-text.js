const db = require('../models/index.js');
const express = require('express');
const router = express.Router();
const speech = require('@google-cloud/speech');
const fs = require('fs');
const multer = require('multer');
const client = new speech.SpeechClient();
const upload = multer({ dest: 'uploads/' });
const ffmpeg = require('fluent-ffmpeg');

// Create a new test

// Function to convert audio file to WAV format using ffmpeg
const convertToWav = (audioFile) => {
    return new Promise((resolve, reject) => {
        const outputPath = `uploads/${audioFile.filename}.wav`;

        ffmpeg(audioFile.path)
            .toFormat('wav')
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
            })
            .on('progress', (progress) => {
                // console.log(JSON.stringify(progress));
                console.log('Processing: ' + progress.targetSize + ' KB converted');
            })
            .on('end', () => {
                console.log('Processing finished !');
            })
            .save(outputPath);//path where you want to save your file
    });
};
router.post('/', upload.single('file'), async (req, res) => {
    console.log(req.file);
    if (!req.file) {
        res.status(400).json({ error: 'No audio file received' });
        return;
    }

    // const audioFile = req.file;
    // console.log(audioFile);
    // const audioBytes = fs.readFileSync(audioFile.path).toString('base64');
    const audioFilePath = await convertToWav(req.file);
    const audioBytes = fs.readFileSync(audioFilePath).toString('base64');
    const audio = {
        content: audioBytes,
    };

    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 8000,
        languageCode: 'en-US',
    };

    const request = {
        audio: audio,
        config: config,
    };

    try {
        const [response] = await client.recognize(request);
        console.log(response.results);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        res.json({ transcription: transcription });
    } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).json({ error: 'Error transcribing audio' });
    }
});


module.exports = router;