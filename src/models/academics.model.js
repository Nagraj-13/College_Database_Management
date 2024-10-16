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
        required : true
    },
    marks: {
        type: Number,
    },
})

const semesterSchema = new mongoose.Schema({
    sem: {
        type:String,
    },
    subjects: [{
        type: subjectSchema
    }],
    sgpa: {
        type: Number
    }
})
const academicSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true
    },
    semesters: [{
        type: semesterSchema
    }],
    cgpa: {
        type: Number
    }
})

export const Academics = mongoose.model('Academics', academicSchema);