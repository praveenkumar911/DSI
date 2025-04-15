const mongoose = require('mongoose');

// TFI Fellow Schema
const fellowSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll_no: { type: String, required: true , unique: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Class Schema 
const classSchema = new mongoose.Schema({
    standard: { type: String, required: true },
    students: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// School Schema
const schoolSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Lesson Schema
const lessonSchema = new mongoose.Schema({
    mailId: { type: String },
    lesson_name: { type: String, required: true },
    progress: { type: Boolean, default: false },
    suggestedActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    selectedActivityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    skills: [{ type: String, required: true }],
    lessonDate: { type: Date, required: true },
    lessonDuration: { type: Number, required: true }, // duration in minutes
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Activity Schema
const activitySchema = new mongoose.Schema({
    activityName: { type: String, required: true },
    activityDescription: { type: String, required: true },
    activityProcedure: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Performance Rating Schema
const performanceRatingSchema = new mongoose.Schema({
    fellowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fellow', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Activity Rating Schema
const activityRatingSchema = new mongoose.Schema({
    fellowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fellow', required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    feedback: { type: String, required: false },
    skillRating: [{ type: String, required: true }], // Example: ["skill_name1: rating_", "skill_name2: rating"]
    createdAt: { type: Date, default: Date.now },
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    standard: { type: Number, required: true },
    marks: { type: Object, default: {} }, // Store marks as key-value pairs
    feedback: { type: String, default: "" },
    performance: { type: Array, default: [] }, // Store performance over time
});

// Message Schema
const messageSchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, // Email of the user
    messages: [
        {
            text: { type: String, required: true }, // Message text
            timestamp: { type: Date, default: Date.now }, // When the message was sent
            sentByUser: { type: Boolean, required: true }, // true if sent by the user, false if received
        },
    ],
});

// Classroom Schema
const classroomSchema = new mongoose.Schema({
    classroomName: { type: String, required: true },
    activity: { type: String, required: true },
    students: [{ type: String }], // Array of student names
    teams: [
        {
            teamMembers: [{ type: String }], // 4 students per team
            activity: { type: String }
        }
    ]
});

// Dashboard Schema
const dashboardSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    note: { type: String, required: true },
});

// Models
const Fellow = mongoose.model('Fellow', fellowSchema);
const Student = mongoose.model('Student', studentSchema);
const Class = mongoose.model('Class', classSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const School = mongoose.model('School', schoolSchema);
const Activity = mongoose.model('Activity', activitySchema);
const PerformanceRating = mongoose.model('PerformanceRating', performanceRatingSchema);
const ActivityRating = mongoose.model('ActivityRating', activityRatingSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Message = mongoose.model('Message', messageSchema);
const Classroom = mongoose.model('Classroom', classroomSchema);
const Dashboard = mongoose.model('Dashboard', dashboardSchema);

// Export Models
module.exports = {
    Fellow,
    Student,
    Class,
    Lesson,
    School,
    Activity,
    PerformanceRating,
    ActivityRating,
    Feedback,
    Message,
    Classroom,
    Dashboard,
};
