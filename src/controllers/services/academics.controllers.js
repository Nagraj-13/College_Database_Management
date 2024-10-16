import asyncHandler from 'express-async-handler';
import responseHandler from '../../utils/responseHandler.js';
import {User}  from '../../models/user.model.js';
import { Academics } from '../../models/academics.model.js';

export const getUserDetails = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                msg: 'User not found',
            });
        }
        const academicDetails =await Academics.findById(user.academics)
        console.log(academicDetails)
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            msg: 'User details retrieved successfully',
            payload: {user, academicDetails}, 
        });
    } catch (error) {
        console.log(`controllers/userController.js : Error fetching user details: ${error}`);
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            msg: 'Internal Server Error',
        });
    }
});
