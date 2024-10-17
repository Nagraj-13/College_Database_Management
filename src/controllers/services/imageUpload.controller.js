import processImage from '../../utils/imageUpload.js';
import uploadImage from '../../config/multer.config.js';
import asyncHandler from 'express-async-handler';
import responseHandler from '../../utils/responseHandler.js';

export const imageUploadController = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                msg: 'No file uploaded',
            });
        }
        const processedData = await processImage(req.file);
        console.log(processedData)
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            msg: 'Image processed successfully',
            payload: { processedData },
        });

    } catch (error) {
        console.error(`controllers/imageController.js: Error: ${error}`);
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            msg: `Image processing failed: ${error.message}`,
        });
    }
});

export { uploadImage };
