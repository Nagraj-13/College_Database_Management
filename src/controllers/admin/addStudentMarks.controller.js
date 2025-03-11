import asyncHandler from "express-async-handler";
import { Academics } from "../../models/academics.model.js";
import responseHandler from "../../utils/responseHandler.js"; 


const updateUserAcademics = asyncHandler(async (req, res) => {
    const { userId, branchName, semesterUpdates } = req.body;

    if (!userId || !branchName || !Array.isArray(semesterUpdates)) {
        return responseHandler(res, {
            success: false,
            statusCode: 400,
            msg: "Invalid input. 'userId', 'branchName', and 'semesterUpdates' are required.",
        });
    }

    let academics = await Academics.findOne({ userId });

    if (!academics) {
        academics = new Academics({ userId, branchName, semesters: [] });
    }

    semesterUpdates.forEach((update) => {
        const { sem, subjects } = update;

        if (!sem || !Array.isArray(subjects)) {
            return; 
        }

        let semester = academics.semesters.find((s) => s.sem === sem);

        if (!semester) {
            semester = { sem, subjects: [] };
            academics.semesters.push(semester);
        }

        subjects.forEach((subjectUpdate) => {
            const { subCode, subName, subCredits, internalMarks, externalMarks, marks, result } =
                subjectUpdate;

            if (!subCode || !subName) {
                return; 
            }

            let subject = semester.subjects.find((s) => s.subCode === subCode);

            if (!subject) {
                subject = {
                    subCode,
                    subName,
                    subCredits,
                    internalMarks,
                    externalMarks,
                    marks,
                    result,
                };
                semester.subjects.push(subject);
            } else {
                subject.subName = subName || subject.subName;
                subject.subCredits = subCredits || subject.subCredits;
                subject.internalMarks = internalMarks || subject.internalMarks;
                subject.externalMarks = externalMarks || subject.externalMarks;
                subject.marks = marks || subject.marks;
                subject.result = result || subject.result;
            }
        });
    });

    await academics.save();

    return responseHandler(res, {
        success: true,
        statusCode: 200,
        msg: "Academic details updated successfully.",
        payload: academics,
    });
});

export { updateUserAcademics };
