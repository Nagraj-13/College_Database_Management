import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subName : {
        type : String,
        required : true
    },
    subCode : {
        type : String,
        required : true
    },
    subCredits : {
        type : Number,
        required : true,
        min: 1, 
        max: 10 
    },
    marks: {
        type: Number,
        min: 0,
        max: 100
    },
    result: {
        type: String,
        enum: ['pass', 'fail']
    }
});

const semesterSchema = new mongoose.Schema({
    sem: {
        type: String,
    },
    subjects: [{
        type: subjectSchema
    }],
    sgpa: {
        type: Number,
        min: 0,
        max: 10
    }
});

const academicSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true
    },
    semesters: [{
        type: semesterSchema
    }],
    cgpa: {
        type: Number,
        min: 0,
        max: 10
    }
});

export const Academics = mongoose.model('Academics', academicSchema);
