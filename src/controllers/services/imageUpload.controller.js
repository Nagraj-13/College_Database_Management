import multer from 'multer';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });
const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const uploadImage = upload.single('image');

const processImage = async (req, res) => {
    try {
        if (!req.file) {
            console.log(req.file)
            return res.status(400).json({ error: 'No file uploaded' });
        }

    
        const uploadResult = await fileManager.uploadFile(req.file.path, {
            mimeType: req.file.mimetype,
            displayName: req.file.originalname,
        });

        const result = await model.generateContent([
            "Tell me about this image.",
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            },
        ]);

    
        fs.unlinkSync(req.file.path);

   
        console.log(result.response.text())
        res.json({ message: 'Image processed successfully', data: result.response.text() });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
};


export { uploadImage, processImage };
