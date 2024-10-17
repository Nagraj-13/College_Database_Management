import { fileManager, model } from '../config/googleAI.config.js';
import fs from 'fs';
import path from 'path';

const processImage = async (file) => {
    const uploadDir = path.resolve('../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
        console.log("Image upload started");

        if (!file) {
            throw new Error('No file provided');
        }
        const validMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only JPEG, PNG, or PDF files are allowed');
        }

        const uploadResult = await fileManager.uploadFile(file.path, {
            mimeType: file.mimetype,
            displayName: file.originalname,
        });

        const result = await model.generateContent([
            "Extract academic data from this image in JSON format with academicData: [{subName, subCode, and marks}].",
            "If no relevant information is found, return empty JSON as academicData: []",
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            },
        ]);
        fs.unlinkSync(file.path);

        return result.response.text();

    } catch (error) {
        console.error('Error processing image:', error.message);
        throw new Error(`Image processing failed: ${error.message}`);
    }
};

export default processImage;
