import asyncHandler from 'express-async-handler';
import responseHandler from '../../utils/responseHandler.js';
import { User } from '../../models/user.model.js';
import { Academics } from '../../models/academics.model.js';

export const updateMarksController = asyncHandler(async (req, res) => {
    try {
        console.log('updateMarksController initiated');

        const { sem, updatedSubjects } = req.body; // Expecting semester and subjects data in request body
        const userId = req.user.id;

        if (!sem || !updatedSubjects || updatedSubjects.length === 0) {
            console.log('\nupdateMarksController: Missing fields in request body');
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                msg: 'Semester or subjects data is missing',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.log('\nupdateMarksController: User not found');
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                msg: 'User not found',
            });
        }

        const academicDetails = await Academics.findById(user.academics);
        if (!academicDetails) {
            console.log('\nupdateMarksController: Academics not found');
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                msg: 'Academics details not found',
            });
        }

        const semester = academicDetails.semesters.find((s) => s.sem === sem);
        if (!semester) {
            console.log('\nupdateMarksController: Semester not found');
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                msg: 'Semester details not found',
            });
        }

        updatedSubjects.forEach((subject) => {
            const existingSubject = semester.subjects.find(
                (s) => s.subCode.trim() === subject.subCode.trim()
            );

            if (existingSubject) {
                // Update marks for existing subject
                existingSubject.internalMarks = subject.internalMarks ?? existingSubject.internalMarks;
                existingSubject.externalMarks = subject.externalMarks ?? existingSubject.externalMarks;
                existingSubject.marks = subject.marks ?? existingSubject.marks;
                existingSubject.result = subject.result ?? existingSubject.result;
            } else {
                // Add new subject if not found
                semester.subjects.push({
                    subName: subject.subName,
                    subCode: subject.subCode,
                    subCredits: subject.subCredits || 0, // Default 0 if not provided
                    internalMarks: subject.internalMarks || 0,
                    externalMarks: subject.externalMarks || 0,
                    marks: subject.marks || 0,
                    result: subject.result || 'fail', // Default 'fail' if not provided
                });
            }
        });

        await academicDetails.save(); // Save updated academics data

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            msg: 'Marks updated successfully',
            payload: { updatedSemester: semester },
        });
    } catch (error) {
        console.error(`updateMarksController: Error: ${error}`);
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            msg: `Failed to update marks: ${error.message}`,
        });
    }
});
